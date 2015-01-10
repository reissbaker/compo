import Database = require('./database');
declare class System {
    onAttach(db: Database): void;
    onDetach(db: Database): void;
    before(delta: number): void;
    update(delta: number): void;
    after(delta: number): void;
    render(delta: number): void;
}
export = System;
