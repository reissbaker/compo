import StateMachine = require('./state-machine');
declare class State {
    private _machine;
    attach(machine: StateMachine): void;
    begin(): void;
    update(delta: number): void;
    end(): void;
    transition(stateName: string): State;
}
export = State;
