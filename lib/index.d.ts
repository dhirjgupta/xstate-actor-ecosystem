import { State, Event } from 'xstate';
import { Dictionary } from 'lodash';
declare type TActorEntry = {
    state: State<any, any, any>;
    send: (event: Event<any>) => void;
    id: string;
};
export declare type TSendToEvent = {
    to: string[];
    msg: {
        type: string;
    };
};
export declare const ECO_ACTIONS: {
    readonly broadcast: "broadcast";
    readonly sendTo: "sendTo";
};
export declare const initActorEcosystem: () => {
    actors: Dictionary<TActorEntry>;
    registerActor: (state: TActorEntry['state'], send: TActorEntry['send'], id?: string | undefined) => void;
    ecoActions: {
        broadcast: (event: Event<{
            type: any;
        }>) => void;
        sendTo: (event: TSendToEvent) => void;
    };
};
export {};
