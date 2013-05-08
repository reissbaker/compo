!function(exports) {
  'use strict';

  var Component = exports.Component,
      ComponentList = exports.ComponentList;

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

    this._children = new ComponentList;
    this.components = new ComponentList;
  });


  SceneNode.prototype.push = function(child) {
    this._children.push(child);
    child.parent = this;
  };

  SceneNode.prototype.remove = function(child) {
    var curr = this._children.remove(child);
    if(curr) curr.parent = null;
    return curr;
  };



  /*
   * Lifecycle Methods
   * -----------------
   */

  SceneNode.prototype.init = function() {
    this.enter();
    this.components.init();
    this._children.init();
  };

  SceneNode.prototype.enter = function() {};

  SceneNode.prototype.destroy = function() {
    this._children.destroy();
    this.components.destroy();
    this.exit();
  };

  SceneNode.prototype.exit = function() {};


  /*
   * Tick Methods
   * ------------
   */

  SceneNode.prototype.before = function(delta, x, y, z) {
    this.components.before(delta, this.x + x, this.y + y, this.z + z);
    this._children.before(delta, this.x + x, this.y + y, this.z + z);
  };

  SceneNode.prototype.update = nodeMethod('update');

  SceneNode.prototype.after = function(delta, x, y, z) {
    this._children.after(delta, this.x + x, this.y + y, this.z + z);
    this.components.after(delta, this.x + x, this.y + y, this.z + z);
  };


  /*
   * Render Methods
   * --------------
   */

  SceneNode.prototype.preprocess = nodeMethod('preprocess');
  SceneNode.prototype.render = nodeMethod('render');
  SceneNode.prototype.postprocess = nodeMethod('postprocess');


  /*
   * Coordinate Methods
   * ------------------
   */

  SceneNode.prototype.xAbsolute = absoluteCoordMethod('x', 'xAbsolute');
  SceneNode.prototype.yAbsolute = absoluteCoordMethod('y', 'yAbsolute');
  SceneNode.prototype.zAbsolute = absoluteCoordMethod('z', 'zAbsolute');



  /*
   * Private Methods
   * ---------------
   */

  function nodeMethod(method) {
    return function(delta, x, y, z) {
      this.components[method](delta, this.x + x, this.y + y, this.z + z);
      this._children[method](delta, this.x + x, this.y + y, this.z + z);
    };
  }

  function absoluteCoordMethod(coord, methodName) {
    return function() {
      return this[coord] + this._parent ? this._parent[methodName]() : 0;
    };
  }


  /*
   * Exports
   * -------
   */

  exports.SceneNode = SceneNode;

}(seine);
