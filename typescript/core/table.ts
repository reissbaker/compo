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

    // remove all indices
    util.remove(this._attached, component);
    util.remove(row, component);

    if(row.length === 0) delete this._primaryIdx[entity.id];

    this._emitter.trigger(DETACH_EVENT, component);

    return component;
  }


  /*
   * Given an entity, detaches all components registered to that entity.
   */

  detachAllFrom(entity: Entity) {
    var row = this._primaryIdx[entity.id];
    if(!row) return;

    // remove secondary indices
    util.each(row, (component: T) => {
      util.remove(this._attached, component);
    });

    // remove primary index
    delete this._primaryIdx[entity.id];

    // trigger events after removal finishes
    util.each(row, (component: T) => {
      this._emitter.trigger(DETACH_EVENT, component)
    });

    return row;
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
  }


  /*
   * Accessors
   * ---------------------------------------------------------------------------
   */

  /*
   * Iteration
   */

  attached(callback: Callback<T>) {
    util.each(this._attached, callback);
  }

  components(entity: Entity, callback: Callback<T>) {
    var row = this._primaryIdx[entity.id];
    if(!row) return;
    util.each(row, callback);
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

