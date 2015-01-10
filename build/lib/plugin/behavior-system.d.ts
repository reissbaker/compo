import Database = require('../core/database');
import System = require('../core/system');
import Table = require('../core/table');
import Behavior = require('./behavior');
declare class BehaviorSystem extends System {
    table: Table<Behavior>;
    onAttach(db: Database): void;
    onDetach(db: Database): void;
    update(delta: number): void;
}
export = BehaviorSystem;
