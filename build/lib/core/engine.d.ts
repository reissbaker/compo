import Kernel = require('./kernel');
declare class Engine {
    kernel: Kernel;
    constructor(kernel: Kernel);
}
export = Engine;
