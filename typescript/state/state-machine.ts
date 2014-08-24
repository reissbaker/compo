'use strict';

import State = require('./state');

class StateMachine {
  private _state: State = null;

  constructor(state: State) {
    this._state = state;
  }

  begin(): void {
    this._state.begin();
  }

  update(delta: number): void {
    this._state.update(delta);
  }

  end(): void {
    this._state.end();
  }

  transition(state: State): State {
    this._state.end();
    this._state = state;
    this._state.begin();

    return state;
  }
}

export = StateMachine;

