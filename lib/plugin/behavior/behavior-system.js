!function(exports) {
  'use strict';

  var System = exports.System,
      Behavior = exports.Behavior;

  exports.BehaviorSystem = System.extend({
    observe: {
      children: Behavior
    },

    before: function(dt) {
      for(var i = 0, l = this.observe.children.length; i < l; i++) {
        this.observe.children[i]._next();
      }
    },

    update: function(dt) {
      for(var i = 0, l = this.observe.children.length; i < l; i++) {
        this.observe.children[i].update(dt);
      }
    },

    after: function(dt) {
      for(var i = 0, l = this.observe.children.length; i < l; i++) {
        this.observe.children[i]._end();
      }
    }

  });

}(compo);
