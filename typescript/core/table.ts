'use strict';

import Component = require('./component');
import events = require('./events');
import Callback = events.Callback;
import Emitter = events.Emitter;
import util = require('./util');
import Entity = require('./entity');

var ATTACH_EVENT = 'attach';
var DETACH_EVENT = 'detach';

class Table<T extends Component> {
  private _attached: T[] = [];
  private _primaryIdx: { [s: number ]: T[] } = {};
  private _emitter = new Emitter<T>(ATTACH_EVENT, DETACH_EVENT);
  private _detached: Entity[] = [];


  /*
   * Given an entity and a component, attaches the component to the entity.
   */

  attach(entity: Entity, component: T) {
    component.entity = entity;

    this._attached.push(component);

    var row = this._primaryIdx[entity.id] = this._primaryIdx[entity.id] || [];
    row.push(component);

    this._emitter.trigger(ATTACH_EVENT, component);

    return component;
  }


  /*
   * Given an entity and a component, detaches the component from the entity.
   */

  detach(entity: Entity, component: T) {
    var row = this._primaryIdx[entity.id];
    if(!row) return;

    // trigger the singular event first, for consistency with `detachAllFrom`
    this._emitter.trigger(DETACH_EVENT, component);

    // track removals for compaction
    this._detached.push(entity);

    // null out all indices
    util.nullify(this._attached, component);
    util.nullify(row, component);

    return component;
  }


  /*
   * Given an entity, detaches all components registered to that entity.
   */

  detachAllFrom(entity: Entity) {
    var row = this._primaryIdx[entity.id];
    if(!row) return;

    // trigger events before nulling out indices
    util.each(row, (component: T) => {
      this._emitter.trigger(DETACH_EVENT, component)
    });

    // null out secondary indices
    util.each(row, (component: T) => {
      util.nullify(this._attached, component);
    });

    // null out and remove primary index immediately, rather than waiting for
    // compaction
    for(var i = 0, l = row.length; i < l; i++) {
      row[i] = null;
    }
    delete this._primaryIdx[entity.id];

    return row;
  }


  /*
   * Compacts the indices. Should be called periodically to ensure null
   * references get cleaned up.
   */

  compact() {
    var curr: Entity;
    for(var curr = this._detached.pop(); curr; curr = this._detached.pop()) {
      var row = this._primaryIdx[curr.id];
      util.compact(row);
      if(row.length === 0) delete this._primaryIdx[curr.id];
    }
    util.compact(this._attached);
  }


  /*
   * Event delegation
   */

  on(event: string, callback: Callback<T>) {
    this._emitter.on(event, callback);
  }

  off(event: string, callback: Callback<T>) {
    this._emitter.off(event, callback);
  }


  /*
   * Resets internal state
   */

  reset() {
    this._emitter = new Emitter<T>(ATTACH_EVENT, DETACH_EVENT);
    this._attached = [];
    this._primaryIdx = {};
    this._detached = [];
  }


  /*
   * Accessors
   * ---------------------------------------------------------------------------
   */

  /*
   * Iteration
   */

  attached(callback: Callback<T>) {
    util.safeEach(this._attached, callback);
  }

  components(entity: Entity, callback: Callback<T>) {
    var row = this._primaryIdx[entity.id];
    if(!row) return;
    util.safeEach(row, callback);
  }


  /*
   * Getters
   */

  getAttached() {
    return this._attached;
  }

  getComponents(entity: Entity) {
    return this._primaryIdx[entity.id];
  }
}

export = Table

