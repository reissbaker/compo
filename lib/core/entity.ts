'use strict';

import Database = require('./database');

class Entity {
  id: number;
  private _db: Database;

  constructor(db: Database, id: number) {
    this._db = db;
    this.id = id;
  }

  entity() {
    return this._db.entity(this);
  }

  destroy() {
    return this._db.destroy(this);
  }

  getParent(): Entity {
    return this._db.getParent(this);
  }

  getChildren(): Entity[] {
    return this._db.getChildren(this);
  }

  isAlive(): boolean {
    return this._db.isAlive(this);
  }
}

export = Entity;
