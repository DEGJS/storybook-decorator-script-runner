import scriptRunner from '../index.js';
import { __fireEvent, __reset, __getDecorator, __setStoryParameters} from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';

function createDomElement(moduleName, moduleAttrName='data-module') {
    const componentEl = document.createElement('div');
    componentEl.setAttribute(moduleAttrName, moduleName);
    document.body.appendChild(componentEl);

    return componentEl;
}

describe('Script runner', () => {
    let originalWarn;

    beforeEach(() => {
        jest.clearAllMocks();
        __reset();

        originalWarn = console.warn;
        console.warn = jest.fn();

    });

    afterEach(() => {
        console.warn = originalWarn;
    });

    it('returns a decorator', () => { 
        const decorator = scriptRunner({});
        expect(decorator).toEqual(__getDecorator());
    });

    describe('global modules', () => {

        it('should run one global module', () => {
            const globalModules = {
                globalModule: jest.fn()
            };

            scriptRunner({globalModules});

            __fireEvent(STORY_RENDERED);

            expect(globalModules.globalModule).toHaveBeenCalledTimes(1);
        });

        it('should run multiple global modules', () => {
            const globalModules = {
                globalModule1: jest.fn(),
                globalModule2: jest.fn()
            };

            scriptRunner({globalModules});

            __fireEvent(STORY_RENDERED);

            expect(globalModules.globalModule1).toHaveBeenCalledTimes(1);
            expect(globalModules.globalModule2).toHaveBeenCalledTimes(1);
        });

        it('should display a console warning if module is not a function', () => {
            const globalModules = {
                globalModule: {}
            };

            scriptRunner({globalModules});

            __fireEvent(STORY_RENDERED);

            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledWith('WARNING: global module globalModule does not exist or is not a function.');
        });

        it('should run a global module specified as a story parameter', () => {
            const globalModules = {
                globalModule: jest.fn()
            };
            
            __setStoryParameters({
                globalModules
            });

            scriptRunner();

            __fireEvent(STORY_RENDERED);

            expect(globalModules.globalModule).toHaveBeenCalledTimes(1);
        });
    });

    describe('dynamic modules', () => {
        beforeEach(() => {
            document.body.innerHTML = "";
        });

        it('should run a dynamic module once for one HTML element', () => {
            const dynamicModules = {
                dynamicModule: jest.fn()
            };

            scriptRunner({dynamicModules});

            const componentEl = createDomElement('dynamicModule');

            __fireEvent(STORY_RENDERED);

            expect(dynamicModules.dynamicModule).toHaveBeenCalledTimes(1);
            expect(dynamicModules.dynamicModule).toHaveBeenCalledWith({containerElement: componentEl});
        });

        it('should run a dynamic module multiple times for multiple HTML elements', () => {
            const dynamicModules = {
                dynamicModule: jest.fn()
            };

            scriptRunner({dynamicModules});

            const componentEl1 = createDomElement('dynamicModule');
            const componentEl2 = createDomElement('dynamicModule');

            __fireEvent(STORY_RENDERED);

            expect(dynamicModules.dynamicModule).toHaveBeenCalledTimes(2);
            expect(dynamicModules.dynamicModule).toHaveBeenNthCalledWith(1, {containerElement: componentEl1});
            expect(dynamicModules.dynamicModule).toHaveBeenNthCalledWith(2, {containerElement: componentEl2});
        });

        it('should not run a dynamic module if no HTML element exists', () => {
            const dynamicModules = {
                dynamicModule: jest.fn()
            };

            scriptRunner({dynamicModules});

            __fireEvent(STORY_RENDERED);

            expect(dynamicModules.dynamicModule).not.toHaveBeenCalled();
        });

        it('should run a dynamic module once for one HTML element with a custom module attribute name', () => {
            const dynamicModules = {
                dynamicModule: jest.fn()
            };

            scriptRunner({dynamicModules, moduleAttrName: 'data-custom'});

            const componentEl = createDomElement('dynamicModule', 'data-custom');

            __fireEvent(STORY_RENDERED);

            expect(dynamicModules.dynamicModule).toHaveBeenCalledTimes(1);
            expect(dynamicModules.dynamicModule).toHaveBeenCalledWith({containerElement: componentEl});
        });

        it('should display a console warning if no module exists for an HTML element', () => {
            const dynamicModules = {};

            scriptRunner({dynamicModules});

            createDomElement('dynamicModule');

            __fireEvent(STORY_RENDERED);

            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledWith('WARNING: dynamic module dynamicModule does not exist or is not a function.');
        });

        it('should display a console warning if module is not a function', () => {
            const dynamicModules = {
                dynamicModule: {}
            };

            scriptRunner({dynamicModules});

            createDomElement('dynamicModule');

            __fireEvent(STORY_RENDERED);

            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledWith('WARNING: dynamic module dynamicModule does not exist or is not a function.');
        });

        it('should run a dynamic module specified as a story parameter', () => {
            const dynamicModules = {
                dynamicModule: jest.fn()
            };

            __setStoryParameters({
                dynamicModules
            });

            scriptRunner();

            const componentEl = createDomElement('dynamicModule');

            __fireEvent(STORY_RENDERED);

            expect(dynamicModules.dynamicModule).toHaveBeenCalledTimes(1);
            expect(dynamicModules.dynamicModule).toHaveBeenCalledWith({containerElement: componentEl});
        });
    });
});