export interface Callback<T> {
    (object: T): void;
}
export declare class Emitter<T> {
    private _handlers;
    constructor(...events: string[]);
    on(event: string, callback: Callback<T>): void;
    off(event: string, callback: Callback<T>): void;
    trigger(event: string, object: T): void;
}
