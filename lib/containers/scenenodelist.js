!function(exports) {
  'use strict';

  var Component = exports.Component,
      ComponentList = exports.ComponentList;

  var SceneNodeList = ComponentList.extend();

  SceneNodeList.prototype.init = function() {
    Component.prototype.init.call(this);
    this._components.forEach(_init);
    this._initialized = true;
    this._destroyed = false;
  };

  SceneNodeList.prototype.destroy = function() {
    Component.prototype.destroy.call(this);
    this._components.forEach(_destroy);
    this._initialized = false;
    this._destroyed = true;
  };

  function _init(node) { node._init(); }
  function _destroy(node) { node._destroy(); }

  exports.SceneNodeList = SceneNodeList;
}(seine);
