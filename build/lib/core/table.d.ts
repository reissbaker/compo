import Component = require('./component');
import events = require('./events');
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
    on(event: string, callback: events.Callback<T>): void;
    off(event: string, callback: events.Callback<T>): void;
    reset(): void;
    attached(callback: events.Callback<T>): void;
    components(entity: Entity, callback: events.Callback<T>): void;
    getAttached(): T[];
    getComponents(entity: Entity): T[];
}
export = Table;
