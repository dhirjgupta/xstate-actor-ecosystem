"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initActorEcosystem = exports.ECO_ACTIONS = void 0;
exports.ECO_ACTIONS = {
    broadcast: 'broadcast',
    sendTo: 'sendTo'
};
exports.initActorEcosystem = function () {
    var _a;
    var actors = {};
    var registerActor = function (state, send, id) {
        if (!id) {
            id = state.configuration[0].id;
            if (!id) {
                throw new Error('xstate-actor-ecosystem: attempted to register an actor without an id');
            }
        }
        actors[id] = { state: state, send: send, id: id };
    };
    var ecoActions = (_a = {},
        _a[exports.ECO_ACTIONS.broadcast] = function (event) {
            for (var actorId in actors) {
                actors[actorId].send(event);
            }
        },
        _a[exports.ECO_ACTIONS.sendTo] = function (event) {
            event.to.forEach(function (actorId) {
                actors[actorId].send(event.msg);
            });
        },
        _a);
    return {
        actors: actors,
        registerActor: registerActor,
        ecoActions: ecoActions
    };
};
