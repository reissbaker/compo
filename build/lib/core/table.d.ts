import Component = require('./component');
import events = require('./events');
import Callback = events.Callback;
import Entity = require('./entity');
declare class Table<T extends Component> {
    private _attached;
    private _primaryIdx;
    private _emitter;
    private _detached;
    attach(entity: Entity, component: T): T;
    detach(entity: Entity, component: T): T;
    detachAllFrom(entity: Entity): T[];
    compact(): void;
    on(event: string, callback: Callback<T>): void;
    off(event: string, callback: Callback<T>): void;
    reset(): void;
    attached(callback: Callback<T>): void;
    components(entity: Entity, callback: Callback<T>): void;
    getAttached(): T[];
    getComponents(entity: Entity): T[];
}
export = Table;
