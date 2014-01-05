!function(exports) {
  'use strict';

  var Component = exports.Component;

  exports.Entity = Component.extend({
    constructor: function() {
      this.children = [];
      Component.apply(this, arguments);
    },


    /*
     * Children
     * -------------------------------------------------------------------------
     */

    push: function(component) {
      this.children.push(component);
      return adopt(this, component);
    },

    pop: function() {
      return disown(this, this.children.pop());
    },

    unshift: function(component) {
      this.children.unshift(component);
      return adopt(this, component);
    },

    shift: function() {
      return disown(this, this.children.shift());
    },

    remove: function(component) {
      var i, l, curr;
      for(i = 0, l = this.children.length; i < l; i++) {
        curr = this.children[i];
        if(curr === component) {
          this.children.splice(i, 1);
          return disown(this, curr);
        }
      }
      return null;
    },

    decorate: function(decorator, options) {
      var toAdd = decorator(options || {});
      for(var prop in toAdd) {
        if(toAdd.hasOwnProperty(prop)) this.push(toAdd[prop]);
      }
      return toAdd;
    },


    /*
     * Lifecycle
     * -------------------------------------------------------------------------
     */

    _start: function() {
      Component.prototype._start.call(this);
      for(var i = 0, l = this.children.length; i < l; i++) {
        this.children[i]._start();
      }
    },

    _stop: function() {
      Component.prototype._stop.call(this);
      for(var i = 0, l = this.children.length; i < l; i++) {
        this.children[i]._stop();
      }
    }

  });

  function adopt(parent, child) {
    if(!child) return null;
    if(parent.started()) child._start();
    return child;
  }

  function disown(parent, child) {
    if(!child) return null;
    if(parent.started()) child._stop();
    return child;
  }

}(compo);
