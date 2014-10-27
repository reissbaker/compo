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


  /*
   * Table lifecycle
   * ---------------------------------------------------------------------------
   */

  /*
   * Creates a new Table<T> in the database.
   */

  table<T extends Component>(): Table<T> {
    var table = new Table<T>();
    this._tables.push(table);
    return table;
  }


  /*
   * Removes a table from the database.
   */

  drop<T extends Component>(table: Table<T>): Table<T> {
    util.remove(this._tables, table);
    return table;
  }


  /*
   * Entity lifecycle
   * ---------------------------------------------------------------------------
   */

  /*
   * Creates an entity with an optional parent.
   *
   * If given a parent, the database will ensure that the child is destroyed
   * if the parent ever is.
   */

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


  /*
   * Destroys an entity.
   *
   * If the entity has any descendants, the descendants will also be destroyed.
   */

  destroy(entity: Entity): Entity {
    if(!this._alive[entity.id]) return;

    // get parent before entity is killed, since the reference will disappear
    var parent = this._parents[entity.id];

    // kill entity
    kill(entity, this._tables, this._alive, this._children, this._parents);

    // clean up parent's child
    if(parent) {
      var parentChildArray = this._children[parent.id];
      util.remove(parentChildArray, entity);
      if(parentChildArray.length === 0) delete this._children[parent.id];
    }

    return entity;
  }


  /*
   * Cleanup methods
   * ---------------------------------------------------------------------------
   */

  /*
   * Compacts all the tables. This should be called periodically to ensure the
   * tables don't become too sparse, which would hurt performance.
   */

  compact() {
    util.each(this._tables, (table) => {
      table.compact();
    });
  }


  /*
   * Resets the database's state.
   */

  reset() {
    this._alive = {};
    this._children = {};
    this._parents = {};

    util.each(this._tables, (table) => {
      table.reset();
    });

    this._tables = [];
  }


  /*
   * Accessors
   * ---------------------------------------------------------------------------
   */

  /*
   * Returns all of the children of the given entity.
   */

  getChildren(entity: Entity): Entity[] {
    return this._children[entity.id];
  }


  /*
   * Returns the parent of the given entity, if one exists.
   */

  getParent(entity: Entity): Entity {
    return this._parents[entity.id];
  }


  /*
   * Returns true if the given entity is live (has never been destroyed).
   *
   * Returns false otherwise.
   */

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
