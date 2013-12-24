/*
 * Better data structure: a modified finger tree. Only leaf nodes are
 * Components, everything else is just a TreeNode. Components store pointers to
 * the next and previous Components in a traversal, so you can just blaze
 * through iterating them like a linked list instead of needing a stack that
 * gets pushed to and popped from.
 *
 * Push: find the last "child", and update its next node to be the new one and
 * update the new one's next node to be the child's next. Update the prev fields
 * accordingly as well.
 *
 * Unshift: the same, but use the first "child".
 *
 * Pop: same as push, but remove the last child instead of inserting a new one.
 * Shift: same, but on first.
 *
 * Remove: iterate through all children, remove the child if you find it.
 */

!function(exports) {
  'use strict';

  var RunQueue = exports.RunQueue,
      DFTList = exports.DFTList;

  function Component() {
    this.next = new RunQueue;
    this.end = new RunQueue;
    this._node = new DFTList(this);
    this._initialized = false;
    this._destroyed = false;
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
    this._node.push(component._node);
    return adopt(this, component);
  };

  Component.prototype.pop = function() {
    return disown(this, this._node.pop()._node);
  };

  Component.prototype.unshift = function(component) {
    this._node.unshift(component._node);
    return adopt(this, component);
  };

  Component.prototype.shift = function() {
    return disown(this, this._node.shift()._node);
  };

  Component.prototype.remove = function(component) {
    var removed = this._node.remove(component._node);
    if(removed) disown(this, component);
    return removed;
  };

  function adopt(parent, child) {
    if(!child) return null;
    if(parent.alive()) child._init();
    return child;
  }

  function disown(parent, child) {
    if(!child) return null;
    if(parent.alive()) child._destroy();
    return child;
  }


  /*
   * Queueing
   * ---------------------------------------------------------------------------
   */

  Component.prototype._next = function() { this.next.fire(); };
  Component.prototype._end = function() { this.end.fire(); };


  /*
   * Lifecycle
   * ---------------------------------------------------------------------------
   */

  Component.prototype._init = function() {
    init(this._node);
    this._node.subtreeEach(init);
  };
  Component.prototype.init = function() {};

  Component.prototype._destroy = function() {
    destroy(this._node);
    this._node.subtreeEach(destroy);
  };
  Component.prototype.destroy = function() {};

  function destroy(node) {
    var component = node.data;
    component.destroy();
    component._destroyed = true;
  }

  function init(node) {
    var component = node.data;
    component.init();
    component._initialized = true;
    component._destroyed = false;
  }


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
