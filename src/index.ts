import { State, Event } from 'xstate';
import { Dictionary } from 'lodash';

type TActorEntry = {
  state: State<any, any, any>;
  send: (event: Event<any>) => void;
  id: string;
};

export type TSendToEvent = {
  to: string[];
  msg: {
    type: string;
  };
};

export const ECO_ACTIONS = {
  broadcast: 'broadcast',
  sendTo: 'sendTo'
} as const;

export const initActorEcosystem = () => {
  const actors: Dictionary<TActorEntry> = {};

  const registerActor = (
    state: TActorEntry['state'],
    send: TActorEntry['send'],
    id?: string
  ) => {
    if (!id) {
      id = state.configuration[0].id;
      if (!id) {
        throw new Error('xstate-actor-ecosystem: attempted to register an actor without an id')
      }
    }
    actors[id] = { state, send, id };
  };

  const ecoActions = {
    [ECO_ACTIONS.broadcast]: (event: Event<{ type: any }>) => {
      for (const actorId in actors) {
        actors[actorId].send(event);
      }
    },
    [ECO_ACTIONS.sendTo]: (event: TSendToEvent) => {
      event.to.forEach(actorId => {
        actors[actorId].send(event.msg);
      });
    }
  };

  return {
    actors,
    registerActor,
    ecoActions
  };
};
