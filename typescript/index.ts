'use strict';

import Component = require('./core/component');
import Table = require('./core/table');
import Database = require('./core/database');
import Kernel = require('./core/kernel');
import System = require('./core/system');
import BehaviorSystem = require('./plugin/behavior-system');
import Behavior = require('./plugin/behavior');
import util = require('./core/util');
import extend = util.extend;
import Runner = require('./core/runner');

var out = {
  Component: Component,
  Table: Table,
  Database: Database,
  System: System,
  Kernel: Kernel,
  BehaviorSystem: BehaviorSystem,
  Behavior: Behavior,
  extend: extend,
  Runner: Runner
};

export = out;
