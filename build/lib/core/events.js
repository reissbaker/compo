'use strict';
var util = require('./util');
var Emitter = (function () {
    function Emitter() {
        var _this = this;
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i - 0] = arguments[_i];
        }
        this._handlers = {};
        util.each(events, function (event) {
            _this._handlers[event] = [];
        });
    }
    Emitter.prototype.on = function (event, callback) {
        if (!this._handlers[event])
            this._handlers[event] = [];
        this._handlers[event].push(callback);
    };
    Emitter.prototype.off = function (event, callback) {
        if (!this._handlers[event])
            return;
        util.remove(this._handlers[event], callback);
    };
    Emitter.prototype.trigger = function (event, object) {
        if (!this._handlers[event])
            return;
        util.each(this._handlers[event], function (callback) {
            callback(object);
        });
    };
    return Emitter;
})();
exports.Emitter = Emitter;
