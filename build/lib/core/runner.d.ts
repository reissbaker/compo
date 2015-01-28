import Kernel = require('./kernel');
import events = require('./events');
import Emitter = events.Emitter;
declare class Runner {
    static BEGIN_EVENT: string;
    static END_EVENT: string;
    _stopped: boolean;
    _prevTime: number;
    _emitter: Emitter<void>;
    _elapsed: number;
    _tickLength: number;
    _kernel: Kernel;
    constructor(kernel: Kernel, tickRate: number);
    start(): void;
    stop(): void;
    on(event: string, callback: () => void): void;
    off(event: string, callback: () => void): void;
}
export = Runner;
