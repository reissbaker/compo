import Table = require('./table');
import Component = require('./component');
import Entity = require('./entity');
declare class Database {
    private _guid;
    private _alive;
    private _children;
    private _parents;
    private _tables;
    table<T extends Component>(): Table<T>;
    drop<T extends Component>(table: Table<T>): Table<T>;
    entity(parent?: Entity): Entity;
    destroy(entity: Entity): Entity;
    compact(): void;
    reset(): void;
    getChildren(entity: Entity): Entity[];
    getParent(entity: Entity): Entity;
    isAlive(entity: Entity): boolean;
}
export = Database;
