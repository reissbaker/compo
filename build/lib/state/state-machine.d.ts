import State = require('./state');
import StateMap = require('./state-map');
declare class StateMachine {
    private _map;
    private _state;
    constructor(states: StateMap);
    begin(): void;
    update(delta: number): void;
    end(): void;
    state(name: string): State;
    currentState(): State;
    setState(name: string): State;
}
export = StateMachine;
