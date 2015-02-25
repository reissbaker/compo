import Entity = require('./entity');
import Component = require('./component');
import Table = require('./table');
export interface Welder<ComponentClass extends Component, Args> {
    attach(e: Entity, args: Args): ComponentClass;
    detach(e: Entity, c: ComponentClass): ComponentClass;
}
export declare class StandardWelder<C extends Component, Args> implements Welder<C, Args> {
    private _table;
    private _builder;
    constructor(table: Table<C>, builder: (args: Args) => C);
    attach(e: Entity, args: Args): C;
    detach(e: Entity, c: C): C;
}
