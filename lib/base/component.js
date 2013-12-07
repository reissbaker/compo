!function(exports) {
  'use strict';

  var RunQueue = exports.RunQueue;

  function Component() {
    this.next = new RunQueue;
    this.end = new RunQueue;
    this._children = [];
    this._initialized = false;
    this._destroyed = false;
    this.parent = null;
  }

  Component.extend = function(Derived) {
    var prop,
        Base = this,
        Temp = function() {};
    Temp.prototype = Base.prototype;
    Temp.prototype.constructor = Temp;

    if(!Derived) Derived = function() { Base.call(this); };

    Derived.prototype = new Temp;
    Derived.prototype.constructor = Derived;

    for(prop in Base) {
      if(Base.hasOwnProperty(prop)) Derived[prop] = Base[prop];
    }

    return Derived;
  };


  /*
   * State
   * ---------------------------------------------------------------------------
   */

  Component.prototype.alive = function() {
    return this._initialized && !this._destroyed;
  };
  Component.prototype.dead = function() {
    return this._destroyed;
  };


  /*
   * Children
   * ---------------------------------------------------------------------------
   */

  Component.prototype.push = function(component) {
    this._children.push(component);
    return adopt(this, component);
  };

  Component.prototype.pop = function() {
    return disown(this, this._children.pop());
  };

  Component.prototype.unshift = function(component) {
    this._children.unshift(component);
    return adopt(this, component);
  };

  Component.prototype.shift = function() {
    return disown(this, this._children.shift());
  };

  Component.prototype.remove = function(component) {
    for(var i = 0, l = this._children.length; i < l; i++) {
      if(this._children[i] === component) {
        this._children.splice(i, 1);
        disown(this, component);
        return true;
      }
    }
    return false;
  };

  function adopt(parent, child) {
    if(!child) return null;
    child.parent = parent;
    if(parent.alive()) child._init();
    return child;
  }

  function disown(parent, child) {
    if(!child) return null;
    if(parent.alive()) child._destroy();
    child.parent = null;
    return child;
  }


  /*
   * Queueing
   * ---------------------------------------------------------------------------
   */

  Component.prototype._next = function() {
    this.next.fire();
    for(var i = 0, l = this._children.length; i < l; i++) {
      this._children[i]._next();
    }
  };

  Component.prototype._end = function() {
    this.end.fire();
    for(var i = 0, l = this._children.length; i < l; i++) {
      this._children[i]._end();
    }
  };


  /*
   * Lifecycle
   * ---------------------------------------------------------------------------
   */

  Component.prototype._init = function() {
    this.init();
    this._initialized = true;
    this._destroyed = false;
    for(var i = 0, l = this._children.length; i < l; i++) {
      this._children[i]._init();
    }
  };
  Component.prototype.init = function() {};

  Component.prototype._destroy = function() {
    this.destroy();
    this._destroyed = true;
    for(var i = 0, l = this._children.length; i < l; i++) {
      this._children[i]._destroy();
    }
  };
  Component.prototype.destroy = function() {};


  /*
   * Method Stubs
   * ---------------------------------------------------------------------------
   */

  stubAll(
    'before', 'update', 'after',
    'preprocess', 'render', 'postprocess'
  );

  function stubAll() {
    var args = Array.prototype.slice.call(arguments);
    args.forEach(stub);
  }

  function stub(name) {
    var priv = '_' + name;
    Component.prototype[priv] = function() {
      this[name]();
      for(var index = 0, l = this._children.length; index < l; index++) {
        this._children[index][priv]();
      }
    };

    Component.prototype[name] = function() {};
  }


  /*
   * Export
   * ---------------------------------------------------------------------------
   */

  exports.Component = Component;

}(seine);
