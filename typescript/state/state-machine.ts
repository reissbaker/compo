'use strict';

import State = require('./state');
import StateMap = require('./state-map');

class StateMachine {
  private _map: StateMap;
  private _state: State = null;

  constructor(states: StateMap) {
    this._map = states;
    for(var prop in states) {
      if(states.hasOwnProperty(prop)) {
        states[prop].attach(this);
      }
    }
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

  state(name: string): State {
    return this._map[name];
  }

  currentState(): State {
    return this._state;
  }

  setState(name: string): State {
    if(this._state) this._state.end();
    this._state = this._map[name];
    this._state.begin();

    return this._state;
  }
}

export = StateMachine;

