require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var Component = (function () {
    function Component() {
    }
    return Component;
})();
module.exports = Component;

},{}],2:[function(require,module,exports){
'use strict';
var util = require('./util');
var Table = require('./table');
var Entity = require('./entity');
var Database = (function () {
    function Database() {
        this._guid = 0;
        this._alive = {};
        this._children = {};
        this._parents = {};
        this._tables = [];
    }
    /*
     * Table lifecycle
     * ---------------------------------------------------------------------------
     */
    /*
     * Creates a new Table<T> in the database.
     */
    Database.prototype.table = function () {
        var table = new Table();
        this._tables.push(table);
        return table;
    };
    /*
     * Removes a table from the database.
     */
    Database.prototype.drop = function (table) {
        util.remove(this._tables, table);
        return table;
    };
    /*
     * Entity lifecycle
     * ---------------------------------------------------------------------------
     */
    /*
     * Creates an entity with an optional parent.
     *
     * If given a parent, the database will ensure that the child is destroyed
     * if the parent ever is.
     */
    Database.prototype.entity = function (parent) {
        if (parent === void 0) { parent = null; }
        var id = this._guid++, entity = new Entity(this, id);
        this._alive[id] = true;
        if (parent != null && this._alive[parent.id]) {
            var row = this._children[parent.id] = this._children[parent.id] || [];
            row.push(entity);
            this._parents[id] = parent;
        }
        return entity;
    };
    /*
     * Destroys an entity.
     *
     * If the entity has any descendants, the descendants will also be destroyed.
     */
    Database.prototype.destroy = function (entity) {
        if (!this._alive[entity.id])
            return;
        // get parent before entity is killed, since the reference will disappear
        var parent = this._parents[entity.id];
        // kill entity
        kill(entity, this._tables, this._alive, this._children, this._parents);
        // clean up parent's child
        if (parent) {
            var parentChildArray = this._children[parent.id];
            util.remove(parentChildArray, entity);
            if (parentChildArray.length === 0)
                delete this._children[parent.id];
        }
        return entity;
    };
    /*
     * Cleanup methods
     * ---------------------------------------------------------------------------
     */
    /*
     * Compacts all the tables. This should be called periodically to ensure the
     * tables don't become too sparse, which would hurt performance.
     */
    Database.prototype.compact = function () {
        util.each(this._tables, function (table) {
            table.compact();
        });
    };
    /*
     * Resets the database's state.
     */
    Database.prototype.reset = function () {
        this._alive = {};
        this._children = {};
        this._parents = {};
        util.each(this._tables, function (table) {
            table.reset();
        });
        this._tables = [];
    };
    /*
     * Accessors
     * ---------------------------------------------------------------------------
     */
    /*
     * Returns all of the children of the given entity.
     */
    Database.prototype.getChildren = function (entity) {
        return this._children[entity.id];
    };
    /*
     * Returns the parent of the given entity, if one exists.
     */
    Database.prototype.getParent = function (entity) {
        return this._parents[entity.id];
    };
    /*
     * Returns true if the given entity is live (has never been destroyed).
     *
     * Returns false otherwise.
     */
    Database.prototype.isAlive = function (entity) {
        return !!this._alive[entity.id];
    };
    return Database;
})();
function kill(entity, tables, alive, children, parents) {
    tables.forEach(function (t) {
        t.detachAllFrom(entity);
    });
    delete alive[entity.id];
    delete parents[entity.id];
    var entityChildren = children[entity.id];
    if (entityChildren) {
        entityChildren.forEach(function (c) {
            kill(c, tables, alive, children, parents);
        });
        delete children[entity.id];
    }
}
module.exports = Database;

},{"./entity":4,"./table":9,"./util":10}],3:[function(require,module,exports){
'use strict';
var Engine = (function () {
    function Engine(kernel) {
        this.kernel = kernel;
    }
    return Engine;
})();
module.exports = Engine;

},{}],4:[function(require,module,exports){
'use strict';
var Entity = (function () {
    function Entity(db, id) {
        this._db = db;
        this.id = id;
    }
    Entity.prototype.entity = function () {
        return this._db.entity(this);
    };
    Entity.prototype.destroy = function () {
        return this._db.destroy(this);
    };
    Entity.prototype.getParent = function () {
        return this._db.getParent(this);
    };
    Entity.prototype.getChildren = function () {
        return this._db.getChildren(this);
    };
    Entity.prototype.isAlive = function () {
        return this._db.isAlive(this);
    };
    return Entity;
})();
module.exports = Entity;

},{}],5:[function(require,module,exports){
'use strict';
var util = require('./util');
var Emitter = (function () {
    function Emitter() {
        var _this = this;
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i - 0] = arguments[_i];
        }
        this._handlers = {};
        util.each(events, function (event) {
            _this._handlers[event] = [];
        });
    }
    Emitter.prototype.on = function (event, callback) {
        if (!this._handlers[event])
            this._handlers[event] = [];
        this._handlers[event].push(callback);
    };
    Emitter.prototype.off = function (event, callback) {
        if (!this._handlers[event])
            return;
        util.remove(this._handlers[event], callback);
    };
    Emitter.prototype.trigger = function (event, object) {
        if (!this._handlers[event])
            return;
        util.each(this._handlers[event], function (callback) {
            callback(object);
        });
    };
    return Emitter;
})();
exports.Emitter = Emitter;

},{"./util":10}],6:[function(require,module,exports){
'use strict';
var util = require('./util');
var Database = require('./database');
var Kernel = (function () {
    function Kernel() {
        this.db = new Database();
        this._systems = [];
        this._root = this.db.entity();
        this._callbacks = [];
    }
    Kernel.prototype.attach = function (system) {
        this._systems.push(system);
        system.onAttach(this.db);
    };
    Kernel.prototype.detach = function (system) {
        util.remove(this._systems, system);
        system.onDetach(this.db);
    };
    Kernel.prototype.tick = function (delta) {
        while (this._callbacks.length > 0) {
            this._callbacks.pop()();
        }
        util.each(this._systems, function (system) {
            system.before(delta);
        });
        util.each(this._systems, function (system) {
            system.update(delta);
        });
        util.backwards(this._systems, function (system) {
            system.after(delta);
        });
        this.db.compact();
    };
    Kernel.prototype.nextTick = function (callback) {
        this._callbacks.push(callback);
    };
    Kernel.prototype.render = function (delta) {
        util.each(this._systems, function (system) {
            system.render(delta);
        });
    };
    Kernel.prototype.root = function () {
        return this._root;
    };
    Kernel.prototype.resetRoot = function () {
        this._root.destroy();
        this._root = this.db.entity();
    };
    Kernel.prototype.reset = function () {
        var _this = this;
        this.resetRoot();
        this._systems.forEach(function (system) {
            system.onDetach(_this.db);
        });
        this._systems = [];
    };
    return Kernel;
})();
module.exports = Kernel;

},{"./database":2,"./util":10}],7:[function(require,module,exports){
'use strict';
var events = require('./events');
var Emitter = events.Emitter;
var TARGET_FPS = 60, TARGET_FRAMETIME = 1000 / TARGET_FPS, MIN_FRAMETIME = 10, MAX_FRAMESKIP = 5;
var rAF = window.requestAnimationFrame || fallback;
function fallback(callback) {
    setTimeout(callback, TARGET_FRAMETIME);
}
var Runner = (function () {
    function Runner(kernel, tickRate) {
        this._stopped = false;
        this._emitter = new Emitter(Runner.BEGIN_EVENT, Runner.END_EVENT);
        this._elapsed = 0;
        this._kernel = kernel;
        this._tickLength = 1000 / tickRate;
    }
    Runner.prototype.start = function () {
        this._stopped = false;
        this._prevTime = (new Date()).valueOf();
        rAF(onTick(this));
    };
    Runner.prototype.stop = function () {
        this._stopped = true;
    };
    Runner.prototype.on = function (event, callback) {
        this._emitter.on(event, callback);
    };
    Runner.prototype.off = function (event, callback) {
        this._emitter.off(event, callback);
    };
    Runner.BEGIN_EVENT = 'beginFrame';
    Runner.END_EVENT = 'endFrame';
    return Runner;
})();
// TODO: Danger Will Robinson: this loop might accidentally start firing twice,
// if you call start() and stop() in quick succession. rAF could fire off a
// second loop, and by the time the first one comes back it'll no longer be
// stopped.
function onTick(runner) {
    function loop() {
        if (runner._stopped)
            return;
        var timestamp = (new Date).valueOf();
        runner._emitter.trigger(Runner.BEGIN_EVENT, null);
        runUpdate(runner, timestamp - runner._prevTime);
        runner._emitter.trigger(Runner.END_EVENT, null);
        runner._prevTime = timestamp;
        rAF(loop);
    }
    return loop;
}
function runUpdate(runner, delta) {
    var consumed = 0, tickLength = runner._tickLength;
    runner._elapsed += Math.min(delta, tickLength * MAX_FRAMESKIP);
    while (runner._elapsed > tickLength) {
        runner._kernel.tick(tickLength);
        runner._elapsed -= tickLength;
        consumed += tickLength;
    }
    if (consumed > 0)
        runner._kernel.render(consumed);
}
module.exports = Runner;

},{"./events":5}],8:[function(require,module,exports){
'use strict';
var System = (function () {
    function System() {
    }
    System.prototype.onAttach = function (db) {
    };
    System.prototype.onDetach = function (db) {
    };
    System.prototype.before = function (delta) {
    };
    System.prototype.update = function (delta) {
    };
    System.prototype.after = function (delta) {
    };
    System.prototype.render = function (delta) {
    };
    return System;
})();
module.exports = System;

},{}],9:[function(require,module,exports){
'use strict';
var events = require('./events');
var Emitter = events.Emitter;
var util = require('./util');
var ATTACH_EVENT = 'attach';
var DETACH_EVENT = 'detach';
var Table = (function () {
    function Table() {
        this._attached = [];
        this._primaryIdx = {};
        this._emitter = new Emitter(ATTACH_EVENT, DETACH_EVENT);
        this._detached = [];
    }
    /*
     * Given an entity and a component, attaches the component to the entity.
     */
    Table.prototype.attach = function (entity, component) {
        component.entity = entity;
        this._attached.push(component);
        var row = this._primaryIdx[entity.id] = this._primaryIdx[entity.id] || [];
        row.push(component);
        this._emitter.trigger(ATTACH_EVENT, component);
        return component;
    };
    /*
     * Given an entity and a component, detaches the component from the entity.
     */
    Table.prototype.detach = function (entity, component) {
        var row = this._primaryIdx[entity.id];
        if (!row)
            return;
        // trigger the event first, for consistency with `detachAllFrom`
        this._emitter.trigger(DETACH_EVENT, component);
        // track removals for compaction
        this._detached.push(entity);
        // null out all indices
        util.nullify(this._attached, component);
        util.nullify(row, component);
        return component;
    };
    /*
     * Given an entity, detaches all components registered to that entity.
     */
    Table.prototype.detachAllFrom = function (entity) {
        var _this = this;
        var row = this._primaryIdx[entity.id];
        if (!row)
            return;
        // trigger events before nulling out indices
        util.each(row, function (component) {
            _this._emitter.trigger(DETACH_EVENT, component);
        });
        // null out secondary indices
        util.each(row, function (component) {
            util.nullify(_this._attached, component);
        });
        for (var i = 0, l = row.length; i < l; i++) {
            row[i] = null;
        }
        delete this._primaryIdx[entity.id];
        return row;
    };
    /*
     * Compacts the indices. Should be called periodically to ensure null
     * references get cleaned up.
     *
     * (In practice, the kernel currently compacts all tables at the end of every
     * `tick` call.)
     */
    Table.prototype.compact = function () {
        var curr;
        while (curr = this._detached.pop()) {
            var row = this._primaryIdx[curr.id];
            util.compact(row);
            if (row.length === 0)
                delete this._primaryIdx[curr.id];
        }
        util.compact(this._attached);
    };
    /*
     * Event delegation
     */
    Table.prototype.on = function (event, callback) {
        this._emitter.on(event, callback);
    };
    Table.prototype.off = function (event, callback) {
        this._emitter.off(event, callback);
    };
    /*
     * Resets internal state
     */
    Table.prototype.reset = function () {
        this._emitter = new Emitter(ATTACH_EVENT, DETACH_EVENT);
        this._attached = [];
        this._primaryIdx = {};
        this._detached = [];
    };
    /*
     * Accessors
     * ---------------------------------------------------------------------------
     */
    /*
     * Iteration
     */
    Table.prototype.attached = function (callback) {
        util.safeEach(this._attached, callback);
    };
    Table.prototype.components = function (entity, callback) {
        var row = this._primaryIdx[entity.id];
        if (!row)
            return;
        util.safeEach(row, callback);
    };
    /*
     * Getters
     */
    Table.prototype.getAttached = function () {
        return this._attached;
    };
    Table.prototype.getComponents = function (entity) {
        return this._primaryIdx[entity.id];
    };
    return Table;
})();
module.exports = Table;

},{"./events":5,"./util":10}],10:[function(require,module,exports){
'use strict';
function backwards(array, callback) {
    for (var i = array.length - 1; i >= 0; i--) {
        callback(array[i]);
    }
}
exports.backwards = backwards;
function each(array, callback) {
    for (var i = 0, l = array.length; i < l; i++) {
        callback(array[i]);
    }
}
exports.each = each;
function safeEach(array, callback) {
    for (var i = 0, l = array.length; i < l; i++) {
        var curr = array[i];
        if (curr != null)
            callback(curr);
    }
}
exports.safeEach = safeEach;
function remove(array, item) {
    for (var i = 0, l = array.length; i < l; i++) {
        if (array[i] === item) {
            array.splice(i, 1);
            return;
        }
    }
}
exports.remove = remove;
function nullify(array, item) {
    for (var i = 0, l = array.length; i < l; i++) {
        if (array[i] === item) {
            array[i] = null;
            return;
        }
    }
}
exports.nullify = nullify;
function compact(array) {
    var start = -1, runLength = 0, inRun = false;
    for (var i = 0, l = array.length; i < l; i++) {
        if (array[i] == null) {
            if (!inRun) {
                inRun = true;
                start = i;
            }
        }
        else if (inRun) {
            runLength = i - start;
            array.splice(start, runLength);
            i -= runLength;
            l -= runLength;
            inRun = false;
        }
    }
    // Clean up at end
    if (inRun)
        array.splice(start, i - start);
}
exports.compact = compact;
function extend(Klass, OtherKlass) {
    var Temp = function () {
    };
    Temp.prototype = Klass.prototype;
    OtherKlass.prototype = new Temp();
    OtherKlass.prototype.constructor = OtherKlass;
    return OtherKlass;
}
exports.extend = extend;

},{}],11:[function(require,module,exports){
'use strict';
var Component = require('./core/component');
var Table = require('./core/table');
var Database = require('./core/database');
var Kernel = require('./core/kernel');
var System = require('./core/system');
var BehaviorSystem = require('./plugin/behavior-system');
var Behavior = require('./plugin/behavior');
var util = require('./core/util');
var extend = util.extend;
var Runner = require('./core/runner');
var Engine = require('./core/engine');
var State = require('./state/state');
var StateMachine = require('./state/state-machine');
var events = require('./core/events');
var out = {
    Component: Component,
    Table: Table,
    Database: Database,
    System: System,
    Kernel: Kernel,
    BehaviorSystem: BehaviorSystem,
    Behavior: Behavior,
    extend: extend,
    Runner: Runner,
    Engine: Engine,
    StateMachine: StateMachine,
    State: State,
    Emitter: events.Emitter
};
module.exports = out;

},{"./core/component":1,"./core/database":2,"./core/engine":3,"./core/events":5,"./core/kernel":6,"./core/runner":7,"./core/system":8,"./core/table":9,"./core/util":10,"./plugin/behavior":13,"./plugin/behavior-system":12,"./state/state":15,"./state/state-machine":14}],12:[function(require,module,exports){
'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var System = require('../core/system');
var BehaviorSystem = (function (_super) {
    __extends(BehaviorSystem, _super);
    function BehaviorSystem() {
        _super.apply(this, arguments);
    }
    BehaviorSystem.prototype.onAttach = function (db) {
        this.table = db.table();
    };
    BehaviorSystem.prototype.onDetach = function (db) {
        db.drop(this.table);
    };
    BehaviorSystem.prototype.update = function (delta) {
        this.table.attached(function (behavior) {
            behavior.update(delta);
        });
    };
    return BehaviorSystem;
})(System);
module.exports = BehaviorSystem;

},{"../core/system":8}],13:[function(require,module,exports){
'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Component = require('../core/component');
var Behavior = (function (_super) {
    __extends(Behavior, _super);
    function Behavior() {
        _super.apply(this, arguments);
    }
    Behavior.prototype.update = function (delta) {
    };
    return Behavior;
})(Component);
module.exports = Behavior;

},{"../core/component":1}],14:[function(require,module,exports){
'use strict';
var StateMachine = (function () {
    function StateMachine(states) {
        this._state = null;
        this._map = states;
        for (var prop in states) {
            if (states.hasOwnProperty(prop)) {
                states[prop].attach(this);
            }
        }
    }
    StateMachine.prototype.begin = function () {
        this._state.begin();
    };
    StateMachine.prototype.update = function (delta) {
        this._state.update(delta);
    };
    StateMachine.prototype.end = function () {
        this._state.end();
    };
    StateMachine.prototype.state = function (name) {
        return this._map[name];
    };
    StateMachine.prototype.currentState = function () {
        return this._state;
    };
    StateMachine.prototype.setState = function (name) {
        if (this._state)
            this._state.end();
        this._state = this._map[name];
        this._state.begin();
        return this._state;
    };
    return StateMachine;
})();
module.exports = StateMachine;

},{}],15:[function(require,module,exports){
'use strict';
var State = (function () {
    function State() {
    }
    State.prototype.attach = function (machine) {
        this._machine = machine;
    };
    State.prototype.begin = function () {
    };
    State.prototype.update = function (delta) {
    };
    State.prototype.end = function () {
    };
    State.prototype.transition = function (stateName) {
        return this._machine.setState(stateName);
    };
    return State;
})();
module.exports = State;

},{}]},{},[11]);
