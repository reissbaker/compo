'use strict';
var util = require('./util');
var Database = require('./database');
var Kernel = (function () {
    function Kernel() {
        this.db = new Database();
        this._systems = [];
        this._root = this.db.entity();
        this._callbacks = [];
    }
    Kernel.prototype.attach = function (system) {
        this._systems.push(system);
        system.onAttach(this.db);
    };
    Kernel.prototype.detach = function (system) {
        util.remove(this._systems, system);
        system.onDetach(this.db);
    };
    Kernel.prototype.tick = function (delta) {
        while (this._callbacks.length > 0) {
            this._callbacks.pop()();
        }
        util.each(this._systems, function (system) {
            system.before(delta);
        });
        util.each(this._systems, function (system) {
            system.update(delta);
        });
        util.backwards(this._systems, function (system) {
            system.after(delta);
        });
        this.db.compact();
    };
    Kernel.prototype.nextTick = function (callback) {
        this._callbacks.push(callback);
    };
    Kernel.prototype.render = function (delta) {
        util.each(this._systems, function (system) {
            system.render(delta);
        });
    };
    Kernel.prototype.root = function () {
        return this._root;
    };
    Kernel.prototype.resetRoot = function () {
        this._root.destroy();
        this._root = this.db.entity();
    };
    Kernel.prototype.reset = function () {
        var _this = this;
        this.resetRoot();
        this._systems.forEach(function (system) {
            system.onDetach(_this.db);
        });
        this._systems = [];
    };
    return Kernel;
})();
module.exports = Kernel;
