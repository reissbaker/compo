'use strict';
var StateMachine = (function () {
    function StateMachine(states) {
        this._state = null;
        this._map = states;
        for (var prop in states) {
            if (states.hasOwnProperty(prop)) {
                states[prop].attach(this);
            }
        }
    }
    StateMachine.prototype.begin = function () {
        this._state.begin();
    };
    StateMachine.prototype.update = function (delta) {
        this._state.update(delta);
    };
    StateMachine.prototype.end = function () {
        this._state.end();
    };
    StateMachine.prototype.state = function (name) {
        return this._map[name];
    };
    StateMachine.prototype.currentState = function () {
        return this._state;
    };
    StateMachine.prototype.setState = function (name) {
        if (this._state)
            this._state.end();
        this._state = this._map[name];
        this._state.begin();
        return this._state;
    };
    return StateMachine;
})();
module.exports = StateMachine;
