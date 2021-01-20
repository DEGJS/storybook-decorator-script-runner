# storybook-decorator-script-runner
![Run Tests](https://github.com/DEGJS/storybook-decorator-script-runner/workflows/Run%20Tests/badge.svg)

A [Storybook for HTML](https://storybook.js.org/docs/guides/guide-html/) decorator that executes JavaScript modules once a story has rendered. This can be useful when JavaScript functionality is dependent on the fully-rendered DOM being available within a story.

## Install
```
npm install @degjs/storybook-decorator-script-runner
```

## Usage
As a global decorator in `.storybook/preview.js` (recommended):
```js
import { addDecorator } from '@storybook/html';
import scriptRunner from '@degjs/storybook-decorator-script-runner';
import someGlobalModule from 'someGlobalModule';
import tabs from 'tabs`;

addDecorator(scriptRunner({
    globalModules: {
        someGlobalModule
    },
    dynamicModules: {
        tabs
    }
}));
```
As a decorator within a story:
```js
import scriptRunner from '@degjs/storybook-decorator-script-runner';
import tabs from 'tabs`;

export default {
    title: 'Tabs',
    decorators: [ scriptRunner ],
    parameters: {
        scripts: {
            dynamicModules: {
                tabs
            }
        }
    }
}
```

## Module Execution
The Script Runner decorator executes JavaScript modules after a story has finished rendering to the DOM. It does this by listening for the `STORY_RENDERED` Storybook event. JavaScript modules are expected to be executable functions.

## Global and Dynamic Modules
The Script Runner decorator can execute two types of JavaScript modules: global and dynamic. 

A global module is JavaScript that should be executed for any story that the Script Runner decorator applies to. Global modules do not necessarily depend on the specific HTML content of a story.

A dynamic module is JavaScript that should only be executed if a specific DOM element exists within the HTML of a story. The Script Runner decorator searches the story HTML for one or more elements that contain a specific data attribute (`data-module` by default) with a value that matches the name of the JavaScript module. If such an element is found, the module will be executed and the element will be passed as a function parameter. This is useful for dynamically executing JavaScript functionality for a component if the supporting HTML for the component exists within a story. 

The example below will execute a Tabs JavaScript module for a story:
```js
/* .storybook/preview.js */

import { addDecorator } from '@storybook/html';
import scriptRunner from '@degjs/storybook-decorator-script-runner';
import tabs from 'tabs`;

addDecorator(scriptRunner({
    dynamicModules: {
        tabs
    }
}));


/* tabs/tabs.js */

function tabs({containerElement}) {
    /* Add tab functionality to the containerElement */
}

export default tabs;


/* tabs/tabs.stories.js */

export default {
    title: 'Components/Tabs'
};

/* The value of the `data-module` HTML attribute matches the name of the tabs module in the dynamicModules object */
export const defaultTabs = () => '<div class="tabs" data-module="tabs">...</div>';
```

## Properties
```js
scriptRunner({
    globalModules: <object>,
    dynamicModules: <object>,
    moduleAttrName: <string>
});
```

### `globalModules: object`
An object containing global modules to execute when a story is rendered. The value of each property in the object should be a module, and each module must be a function.

### `dynamicModules: object`
An object containing dynamic modules to execute when a story is rendered. A dynamic modules is only executed if a corresponding DOM element in the rendered story is found. The name of each property in the object should be a module name, and the value of each property in the object should be a module itself. Each module must be a function. When the function is executed, it will be passed the following object as a parameter containing the corresponding DOM element:
```js
{
    containerElement: <element>
}
```

### `moduleAttrName: string`
The name of a DOM element attribute containing the name of a dynamic module. This attribute links a DOM element to a dynamic module.  Default: `data-module`.