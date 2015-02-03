import System = require('./system');
import Database = require('./database');
import Entity = require('./entity');
declare class Kernel {
    db: Database;
    private _systems;
    private _root;
    private _callbacks;
    attach(system: System): void;
    detach(system: System): void;
    tick(delta: number): void;
    nextTick(callback: () => any): void;
    render(delta: number): void;
    root(): Entity;
    resetRoot(): void;
    reset(): void;
}
export = Kernel;
