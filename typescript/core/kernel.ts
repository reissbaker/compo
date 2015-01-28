'use strict';

import util = require('./util');
import System = require('./system');
import Database = require('./database');
import Entity = require('./entity');

class Kernel {
  db: Database = new Database();
  private _systems: System[] = [];
  private _root = this.db.entity();
  private _callbacks: Array<() => any> = [];

  attach(system: System) {
    this._systems.push(system);
    system.onAttach(this.db);
  }

  detach(system: System) {
    util.remove(this._systems, system);
    system.onDetach(this.db);
  }

  tick(delta: number) {
    while(this._callbacks.length > 0) {
      this._callbacks.pop()();
    }
    util.each(this._systems, (system) => {
      system.before(delta);
    });
    util.each(this._systems, (system) => {
      system.update(delta);
    });
    util.backwards(this._systems, (system) => {
      system.after(delta);
    });
    this.db.compact();
  }

  nextTick(callback: () => any): void {
    this._callbacks.push(callback);
  }

  render(delta: number) {
    util.each(this._systems, (system) => {
      system.render(delta);
    });
  }

  root(): Entity {
    return this._root;
  }

  resetRoot(): void {
    this._root.destroy();
    this._root = this.db.entity();
  }
}

export = Kernel;
