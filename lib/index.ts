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
import Engine = require('./core/engine');
import State = require('./state/state');
import StateMachine = require('./state/state-machine');
import events = require('./core/events');
import Welder = require('./core/welder');

var out = {
  Component: Component,
  Table: Table,
  Database: Database,
  System: System,
  Kernel: Kernel,
  BehaviorSystem: BehaviorSystem,
  Behavior: Behavior,
  extend: extend,
  Runner: Runner,
  Engine: Engine,
  StateMachine: StateMachine,
  State: State,
  Emitter: events.Emitter,
  welder: Welder
};

export = out;
