'use strict';

import Kernel = require('./kernel');

class Engine {
  kernel: Kernel;

  constructor(kernel: Kernel) {
    this.kernel = kernel;
  }
}

export = Engine;

