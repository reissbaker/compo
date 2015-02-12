'use strict';

import State = require('./state');

interface StateMap {
  [ name: string ]: State
}

export = StateMap;

