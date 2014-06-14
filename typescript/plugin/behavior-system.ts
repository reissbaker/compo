'use strict';

import Entity = require('../core/entity');
import Database = require('../core/database');
import System = require('../core/system');
import Table = require('../core/table');

import Behavior = require('./behavior');

class BehaviorSystem extends System {
  table: Table<Behavior>;

  onAttach(db: Database) {
    this.table = db.table<Behavior>();
  }

  onDetach(db: Database) {
    db.drop<Behavior>(this.table);
  }

  update(delta: number) {
    this.table.attached((behavior: Behavior) => {
      behavior.update(delta);
    });
  }
}

export = BehaviorSystem;
