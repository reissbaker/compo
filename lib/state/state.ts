'use strict';

import StateMachine = require('./state-machine');

class State {
  private _machine: StateMachine;

  attach(machine: StateMachine) {
    this._machine = machine;
  }

  begin(): void {
  }

  update(delta: number): void {
  }

  end(): void {
  }

  transition(stateName: string): State {
    return this._machine.setState(stateName);
  }
}

export = State;

