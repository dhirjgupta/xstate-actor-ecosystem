# xstate-actor-ecosystem

This library implements a custom actor model mechansim and the means of  communication amongst the actors within that "ecosystem" of actors. It was built primarily with React.js in mind, though it isn't limited to use in React.js in any way.

### A React.js example

Create a file and initialize one or more actor ecosystems and export
```js
// ecosystems.js
import { initActorEcosystem } from '@xstate-ecosystem/core'

export const {
    actors,
    registerActor,
    ecoActions
} = initActorEcosystem();
```
To register an actor:

```js
// MyComponent.js
import {registerActor} from './ecosystem';

const MyComponent = (props) => {
    const ref = React.useRef();
    const [machine, send] = useMachine(
        MachineA.withConfig({
            services: generateAnimationServices(ref)
        })
    );
    React.useEffect(() => {
        registerActor(machine, send, 'MachineA');
    }, []);

    ...
}
```

In your machine definition, import the ecoActions object of the ecosystem.
```js
// MachineA.js
import { ecoActions } from '../ecosystem'

const MachineA = Machine({
    id: ...
    states: ...
    },
    actions: {
        action1: () => {
            ecoActions.sendTo({
                to: ['MachineB', 'MachineC'],
                msg: {
                    type: "EVENT_NAME",

                }
            });
        },
        action2: () => {
            ecoActions.broadcast({
                type: "EVENT_NAME",
            });
        }
    },
    services: {...}
})
```

### API

`initActorEcosystem` - fn called with no arguments which creates an actor ecosystem. Returns an object containing:

1.  `actors` - Dictionary of objects, describing a registered actor, each of the shape:
```ts
{
    state: State<any, any, any>;
    send: (event: Event<any>) => void;
    id: string;
}
```
2. `registerActor` - fn used to register an actor in the ecosystem. Fn signature:
        `(state: State<any, any, any>, send: (event: Event<any>) => void, id: string) => void`
3. `ecoActions` - object containing two means to handle communications amongst your registered actors:
    
    1. broadcast - fn used to send an event to all registered actors. Whether they listen for that event or not is a separate matter, which makes this the recommended default communication mechanism. Takes an argument of type: 
        ```Event<any>```
    
    2. sendTo - fn used to send an event to one or more particular registered actors. This is used when many actors listen for a certain type of event, but you only want particular actors reacting to it. Takes an argument of type:
        ```js
        {
            to: string[] // list of registered actor ids to send to,
            msg: Event<any> // event you wish to send
        }
        ```
