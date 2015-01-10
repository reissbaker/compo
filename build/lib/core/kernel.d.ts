import System = require('./system');
import Database = require('./database');
import Entity = require('./entity');
declare class Kernel {
    db: Database;
    private _systems;
    private _root;
    attach(system: System): void;
    detach(system: System): void;
    tick(delta: number): void;
    render(delta: number): void;
    root(): Entity;
    resetRoot(): void;
}
export = Kernel;
