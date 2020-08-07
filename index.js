import {addons, makeDecorator} from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';

const defaultOptions = {
    globalModules: {},
    dynamicModules: {},
    moduleAttrName: 'data-module'
};

export default makeDecorator({
    name: 'scriptRunner',
    parameterName: 'scripts',
    skipIfNoParametersOrOptions: false,
    wrapper: (storyFn, context, { options={}, parameters={} }) => {
        const channel = addons.getChannel();  

        const {
            globalModules,
            dynamicModules,
            moduleAttrName
        } = {...defaultOptions, ...options, ...parameters};

        channel.once(STORY_RENDERED, () => {
            runGlobalModules(globalModules);    
            runDynamicModules(dynamicModules, moduleAttrName);
            
        });
        return storyFn(context);
    }
});

function runDynamicModules(dynamicModules, moduleAttrName) {
    if(dynamicModules) {
        const containerEls = [...document.querySelectorAll(`[${moduleAttrName}]`)];
        containerEls.forEach(containerElement => {
            const moduleName = containerElement.getAttribute(moduleAttrName);
            const module = dynamicModules[moduleName];

            if(isFunction(module)) {
                module({containerElement});
            } else {
                console.warn(`WARNING: dynamic module ${moduleName} does not exist or is not a function.`);
            }
        });  
    }
}

function runGlobalModules(globalModules) {
    if(globalModules) {
        Object.keys(globalModules).forEach(moduleName => {
            const module = globalModules[moduleName];
            if(isFunction(module)) {
                module();
            } else {
                console.warn(`WARNING: global module ${moduleName} does not exist or is not a function.`);
            }
        });
    }
}

function isFunction(func) {
    return func && typeof func === 'function';
}