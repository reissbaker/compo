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

  attach(system: System): void {
    this._systems.push(system);
    system.onAttach(this.db);
  }

  detach(system: System): void {
    util.remove(this._systems, system);
    system.onDetach(this.db);
  }

  tick(delta: number): void {
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

  render(delta: number): void {
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

  reset(): void {
    this.resetRoot();
    this._systems.forEach((system) => {
      system.onDetach(this.db);
    });
    this._systems = [];
    this._callbacks = [];
  }
}

export = Kernel;
