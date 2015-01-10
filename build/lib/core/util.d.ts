export declare function backwards<T>(array: T[], callback: (el: T) => any): void;
export declare function each<T>(array: T[], callback: (el: T) => any): void;
export declare function safeEach<T>(array: T[], callback: (el: T) => any): void;
export declare function remove<T>(array: T[], item: T): void;
export declare function nullify<T>(array: T[], item: T): void;
export declare function compact<T>(array: T[]): void;
export interface Constructor {
    (): void;
}
export declare function extend(Klass: Constructor, OtherKlass: Constructor): Constructor;
export interface NumericMap<V> {
    [key: number]: V;
}
export interface StringMap<V> {
    [key: string]: V;
}
