'use strict';

import Database = require('./database');

class System {
  onAttach(db: Database) {
  }

  onDetach(db: Database) {
  }

  before(delta: number) {
  }

  update(delta: number) {
  }

  after(delta: number) {
  }

  render(delta: number) {
  }
}

export = System;
