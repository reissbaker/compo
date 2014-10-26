'use strict';

import util = require('./util');
import Table = require('./table');
import Component = require('./component');
import Entity = require('./entity');

class Database {
  private _guid: number = 0;

  private _alive: { [id: number]: boolean } = {};
  private _children: { [id: number]: Entity[] } = {};
  private _parents: { [id: number]: Entity } = {};

  private _tables: Table<any>[] = [];

  table<T extends Component>(): Table<T> {
    var table = new Table<T>();
    this._tables.push(table);
    return table;
  }

  drop<T extends Component>(table: Table<T>): Table<T> {
    util.remove(this._tables, table);
    return table;
  }

  entity(parent: Entity = null): Entity {
    var id = this._guid++,
        entity = new Entity(this, id);
    this._alive[id] = true;

    if(parent != null && this._alive[parent.id]) {
      var row = this._children[parent.id] = this._children[parent.id] || [];
      row.push(entity);
      this._parents[id] = parent;
    }

    return entity;
  }

  destroy(entity: Entity): Entity {
    if(!this._alive[entity.id]) return;

    kill(entity, this._tables, this._alive, this._children, this._parents);

    var parent = this._parents[entity.id];

    if(parent) {
      var parentChildArray = this._children[parent.id];
      util.remove(parentChildArray, entity);
    }

    return entity;
  }

  reset() {
    this._alive = {};
    this._children = {};
    this._parents = {};

    util.each(this._tables, (table) => {
      table.reset();
    });

    this._tables = [];
  }

  getChildren(entity: Entity): Entity[] {
    return this._children[entity.id];
  }

  getParent(entity: Entity): Entity {
    return this._parents[entity.id];
  }

  isAlive(entity: Entity): boolean {
    return !!this._alive[entity.id];
  }
}

function kill(
  entity: Entity,
  tables: Table<any>[],
  alive: { [id: number]: boolean },
  children: { [id: number]: Entity[] },
  parents: { [id: number]: Entity }
) {
  tables.forEach((t) => {
    t.detachAllFrom(entity);
  });

  delete alive[entity.id];
  delete parents[entity.id];

  var entityChildren = children[entity.id];
  if(entityChildren) {
    entityChildren.forEach((c) => {
      kill(c, tables, alive, children, parents);
    });
    delete children[entity.id];
  }
}

export = Database;
