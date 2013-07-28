!function(exports) {
  'use strict';

  var Component = exports.Component;

  var ComponentList = Component.extend(function() {
    Component.call(this);

    this._components = [];
    this._initialized = false;
    this._destroyed = false;
  });


  ComponentList.prototype.push = function(component) {
    this._components.push(component);
    if(this._initialized) component.init();
    return component;
  };

  ComponentList.prototype.remove = function(component) {
    var curr;
    for(var i = 0, l = this._components.length; i < l; i++) {
      curr = this._components[i];
      if(curr === component) {
        if(!this._destroyed) curr.destroy();
        this._components.splice(i, 1);
        return curr;
      }
    }

    return null;
  };

  ComponentList.prototype.init = function() {
    this._components.forEach(function(component) { component.init(); });
    this._initialized = true;
    this._destroyed = false;
  };

  ComponentList.prototype.destroy = function() {
    this._components.forEach(function(component) { component.destroy(); });
    this._initialized = false;
    this._destroyed = true;
  };

  ComponentList.prototype.before = function(delta, x, y, z) {
    this._components.forEach(fireNext);
    eachFourArityMethod(this._components, 'before', delta, x, y, z);
  };

  ComponentList.prototype.after = function(delta, x, y, z) {
    eachFourArityMethod(this._components, 'after', delta, x, y, z);
    this._components.forEach(fireEnd);
  };


  ['update', 'preprocess', 'render', 'postprocess'].forEach(function(method) {
    ComponentList.prototype[method] = fourArityMethod(method);
  });


  function fourArityMethod(name) {
    return function(a1, a2, a3, a4) {
      eachFourArityMethod(this._components, name, a1, a2, a3, a4);
    };
  }

  function eachFourArityMethod(arr, method, a1, a2, a3, a4) {
    for(var index = 0, length = arr.length; index < length; index++) {
      arr[index][method](a1, a2, a3, a4);
    }
  }

  function fireNext(c) { c.next.fire(); }
  function fireEnd(c) { c.end.fire(); }

  exports.ComponentList = ComponentList;

}(seine);
