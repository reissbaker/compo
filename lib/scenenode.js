!function(exports) {
  'use strict';

  var Component = exports.Component;

  /*
   * Constructor
   * -----------
   */

  var SceneNode = Component.extend(function SceneNode(x, y, z) {
    Component.call(this);
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

    this._parent = null;
    this._children = [];

    this.components = [];
  });

  /*
   * Lifecycle Methods
   * -----------------
   */

  SceneNode.prototype.begin = function() {
    this.proto.begin.call(this);
    each(this.components, fireBegin);
    each(this._children, fireBegin);
  };

  SceneNode.prototype.finish = function() {
    this.proto.finish.call(this);
    each(this._children, fireEnd);
    each(this.components, fireEnd);
  };

  /*
   * Tick Methods
   * ------------
   */

  SceneNode.prototype.before = function(delta, x, y, z) {
    each(this.components, fireNext);
    each(this._children, fireNext);
    // inefficient: allocates before method each time
    runMethods(this, method('before'), delta, x, y, z);
  };

  SceneNode.prototype.update = nodeMethod(method('update'));

  SceneNode.prototype.after = function(delta, x, y, z) {
    // inefficient: allocates after method each time
    runMethods(this, method('after'), delta, x, y, z);
    each(this._children, fireEnd);
    each(this.components, fireEnd);
  };


  /*
   * Render Methods
   * --------------
   */

  SceneNode.prototype.preprocess = nodeMethod(method('preprocess'));
  SceneNode.prototype.render = nodeMethod(method('render'));
  SceneNode.prototype.postprocess = nodeMethod(method('postprocess'));


  /*
   * Coordinate Methods
   * ------------------
   */

  SceneNode.prototype.xAbsolute = absoluteCoordMethod('x', 'xAbsolute');
  SceneNode.prototype.yAbsolute = absoluteCoordMethod('y', 'yAbsolute');
  SceneNode.prototype.zAbsolute = absoluteCoordMethod('z', 'zAbsolute');


  /*
   * Child Methods
   * -------------
   */

  SceneNode.prototype.add = function(child) {
    if(child) {
      this._children.push(child);
      child._parent = this;
      if(this.initialized) child.begin();
    }
  };

  SceneNode.prototype.remove = function(child) {
    for(var curr, index = 0; curr = this._children[index]; index++) {
      if(curr === child) {
        this._children.splice(index, 1);
        curr._parent = null;
        curr.finish();
        return true;
      }
    }
    return false;
  };


  /*
   * Private Methods
   * ---------------
   */

  function nodeMethod(fn) {
    return function(delta, x, y, z) { runMethods(this, fn, delta, x, y, z); };
  }

  function runMethods(node, fn, delta, x, y, z) {
    each4args(node.components, fn, delta, x, y, z);
    each4args(node._children, fn, delta, x, y, z);
  }

  function absoluteCoordMethod(coord, methodName) {
    return function() {
      return this[coord] + this._parent ? this._parent[methodName]() : 0;
    };
  }



  /*
   * Helper Functions
   * ----------------
   */


  /*
   * ### each4args ###
   *
   * Kludgy, but using `apply` is slow and this is called quite a bit. Does
   * exactly what you'd expect: acts like an `each` function that also takes
   * four additional args to pass to the callback.
   */

  function each4args(arr, callback, a1, a2, a3, a4) {
    for(var index = 0, length = arr.length; index < length; index++) {
      callback(arr[index], a1, a2, a3, a4);
    }
  }

  function each(arr, fn) {
    for(var i = 0, l = arr.length; i < l; i++) {
      fn(arr[i]);
    }
  }

  function fireEnd(c) { c.end.fire(); }
  function fireNext(c) { c.next.fire(); }
  function fireBegin(c) { c.begin(); }
  function fireFinish(c) { c.finish(); }

  function method(name) {
    return function(obj, delta, x, y, z) { obj[name](delta, x, y, z); };
  }


  /*
   * Exports
   * -------
   */

  exports.SceneNode = SceneNode;

}(seine);
