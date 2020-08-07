const storyFn = () => {};
const context = {};
let decorator = {};
let subscribers = [];
let storyParameters = {};

const channel = {
    once: (eventName, handler) => { 
        subscribers.push({
            eventName,
            handler
        });
    }
}

const addons = {
    getChannel: () => channel
};

const makeDecorator = jest.fn(({wrapper}) => {
    return function(options) {
        wrapper(storyFn, context, {options, parameters: storyParameters});
        return decorator;
    };
});

function __fireEvent(eventNameToFire) {
    subscribers
        .filter(({eventName}) => eventName === eventNameToFire)
        .forEach(({_, handler}) => handler());
}

function __reset() {
    subscribers = [];
    storyParameters = {};
}

function __setStoryParameters(params) {
    storyParameters = params;
}

function __getDecorator() {
    return decorator;
}

export { 
    makeDecorator, 
    addons,
    __fireEvent,
    __reset,
    __getDecorator,
    __setStoryParameters
};