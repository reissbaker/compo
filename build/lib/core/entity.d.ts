import Database = require('./database');
declare class Entity {
    id: number;
    private _db;
    constructor(db: Database, id: number);
    entity(): Entity;
    destroy(): Entity;
    getParent(): Entity;
    getChildren(): Entity[];
    isAlive(): boolean;
}
export = Entity;
