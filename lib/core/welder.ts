'use strict';

/*
 * Welders are wrappers around the two-step of creating a Component from a set of arguments, and
 * actually attaching that component to a table keyed by an entity. Rather than exposing raw tables,
 * Systems should expose Welders that take arguments to construct objects and attach them to one or
 * more of the System's tables.
 *
 * This allows for clean, consistent System APIs regardless of how the tables are organized under
 * the hood. For example, rather than the dichotomy of:
 *
 *     // Physics system has separate grid, tile tables:
 *     var tilePhysics = new TilePhysics({ ... });
 *     physicsSystem.tiles.attach(entity, tilePhysics);
 *     var gridPhysics = new GridPhysics({ ... });
 *     physicsSystem.grids.attach(level, gridPhysics);
 *
 *     // Rendering system doesn't:
 *     var animation = new Animation({ ... });
 *     renderer.table.attach(entity, animation);
 *     var levelGrid = new GridImage({ ... });
 *     renderer.table.attach(level, levelGrid);
 *
 * You could instead have:
 *
 *     var tilePhysics = physicsSystem.tiles.attach(entity, { ... });
 *     var gridPhysics = physicsSystem.grids.attach(level, { ... });
 *     var animation = renderer.animation.attach(entity, { ... });
 *     var gridImage = renderer.grids.attach(level, { ... });
 */


import Entity = require('./entity');
import Component = require('./component');
import Table = require('./table');

export interface Welder<ComponentClass extends Component, Args> {
  attach(e: Entity, args: Args): ComponentClass;
  detach(e: Entity, c: ComponentClass): ComponentClass;
}

export class StandardWelder<C extends Component, Args> implements Welder<C, Args> {
  private _table: Table<C>;
  private _builder: (args: Args) => C;

  constructor(table: Table<C>, builder: (args: Args) => C) {
    this._table = table;
    this._builder = builder;
  }

  attach(e: Entity, args: Args): C {
    var component = this._builder(args);
    return this._table.attach(e, component);
  }

  detach(e: Entity, c: C): C {
    return this._table.detach(e, c);
  }
}
