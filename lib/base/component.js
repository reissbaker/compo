/*
 * IDEA: Skip-tree. Like a skiplist, but the skips are in the tree, and rather
 * than being random they're based on what methods the objects have.
 *
 * So there's one set of pointers for objects with an update method, another for
 * objects with a render method, etc. Should massively cut down on iteration
 * while adding only instantiation and destruction bookkeeping cost. Need to
 * bubble children up when pushing/unshifting them, and make sure to deregister
 * on destruction. Best of all... No branching during tight loops!
 *
 * Tricky thought... How do you deal with unshifting grandchildren? Maybe splice
 * in at the correct index? How do you find the correct index in less than O(n)?
 * Could keep track with index in child arrays, worst case complexity is
 * O(size_of_child_array). No: don't even bother. Just find the first child in
 * the parent's child array, and insert it before that one.
 *
 * Ok: don't use this skip-tree idea. Just store everything in a big flat array.
 *
 * Also you should benchmark iterative calls against the recursive ones.
 */

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

  Component.extend = function(methods) {
    var prop,
        Base = this,
        Derived = function() { Base.call(this); },
        Temp = function() {};

    if(methods.hasOwnProperty('constructor')) Derived = methods.constructor;

    Temp.prototype = Base.prototype;
    Temp.prototype.constructor = Temp;

    Derived.prototype = new Temp;
    Derived.prototype.constructor = Derived;

    for(prop in Base) {
      if(Base.hasOwnProperty(prop)) Derived[prop] = Base[prop];
    }

    for(prop in methods) {
      if(methods.hasOwnProperty(prop) && prop !== 'constructor') {
        Derived.prototype[prop] = methods[prop];
      }
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

  function stub() {}

  Component.prototype.update = stub;
  Component.prototype.preprocess = stub;
  Component.prototype.render = stub;
  Component.prototype.postprocess = stub;


  /*
   * Export
   * ---------------------------------------------------------------------------
   */

  exports.Component = Component;

}(seine);
