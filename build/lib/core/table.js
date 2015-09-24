'use strict';
var events = require('./events');
var Emitter = events.Emitter;
var util = require('./util');
var ATTACH_EVENT = 'attach';
var DETACH_EVENT = 'detach';
var Table = (function () {
    function Table() {
        this._attached = [];
        this._primaryIdx = {};
        this._emitter = new Emitter(ATTACH_EVENT, DETACH_EVENT);
        this._detached = [];
    }
    /*
     * Given an entity and a component, attaches the component to the entity.
     */
    Table.prototype.attach = function (entity, component) {
        component.entity = entity;
        this._attached.push(component);
        var row = this._primaryIdx[entity.id] = this._primaryIdx[entity.id] || [];
        row.push(component);
        this._emitter.trigger(ATTACH_EVENT, component);
        return component;
    };
    /*
     * Given an entity and a component, detaches the component from the entity.
     */
    Table.prototype.detach = function (entity, component) {
        var row = this._primaryIdx[entity.id];
        if (!row)
            return;
        // trigger the event first, for consistency with `detachAllFrom`
        this._emitter.trigger(DETACH_EVENT, component);
        // track removals for compaction
        this._detached.push(entity);
        // null out all indices
        util.nullify(this._attached, component);
        util.nullify(row, component);
        return component;
    };
    /*
     * Given an entity, detaches all components registered to that entity.
     */
    Table.prototype.detachAllFrom = function (entity) {
        var _this = this;
        var row = this._primaryIdx[entity.id];
        if (!row)
            return;
        // trigger events before nulling out indices
        util.each(row, function (component) {
            _this._emitter.trigger(DETACH_EVENT, component);
        });
        // null out secondary indices
        util.each(row, function (component) {
            util.nullify(_this._attached, component);
        });
        // null out and remove primary index immediately, rather than waiting for
        // compaction. we know it can be deleted, the only question is whether
        // existing code is iterating through the now-dead components.
        for (var i = 0, l = row.length; i < l; i++) {
            row[i] = null;
        }
        delete this._primaryIdx[entity.id];
        return row;
    };
    /*
     * Compacts the indices. Should be called periodically to ensure null
     * references get cleaned up.
     *
     * (In practice, the kernel currently compacts all tables at the end of every
     * `tick` call.)
     */
    Table.prototype.compact = function () {
        var curr;
        while (curr = this._detached.pop()) {
            var row = this._primaryIdx[curr.id];
            util.compact(row);
            if (row.length === 0)
                delete this._primaryIdx[curr.id];
        }
        util.compact(this._attached);
    };
    /*
     * Event delegation
     */
    Table.prototype.on = function (event, callback) {
        this._emitter.on(event, callback);
    };
    Table.prototype.off = function (event, callback) {
        this._emitter.off(event, callback);
    };
    /*
     * Resets internal state
     */
    Table.prototype.reset = function () {
        this._emitter = new Emitter(ATTACH_EVENT, DETACH_EVENT);
        this._attached = [];
        this._primaryIdx = {};
        this._detached = [];
    };
    /*
     * Accessors
     * ---------------------------------------------------------------------------
     */
    /*
     * Iteration
     */
    Table.prototype.attached = function (callback) {
        util.safeEach(this._attached, callback);
    };
    Table.prototype.components = function (entity, callback) {
        var row = this._primaryIdx[entity.id];
        if (!row)
            return;
        util.safeEach(row, callback);
    };
    /*
     * Getters
     */
    Table.prototype.getAttached = function () {
        return this._attached;
    };
    Table.prototype.getComponents = function (entity) {
        return this._primaryIdx[entity.id];
    };
    return Table;
})();
module.exports = Table;
