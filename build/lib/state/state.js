'use strict';
var State = (function () {
    function State() {
    }
    State.prototype.attach = function (machine) {
        this._machine = machine;
    };
    State.prototype.begin = function () {
    };
    State.prototype.update = function (delta) {
    };
    State.prototype.end = function () {
    };
    State.prototype.transition = function (stateName) {
        return this._machine.setState(stateName);
    };
    return State;
})();
module.exports = State;
