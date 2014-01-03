!function(exports) {
  'use strict';

  var Component = exports.Component,
      RunQueue = exports.RunQueue;

  exports.Behavior = Component.extend({
    constructor: function() {
      this.next = new RunQueue;
      this.end = new RunQueue;
      Component.apply(this, arguments);
    },

    /*
     * Queueing
     * -------------------------------------------------------------------------
     */

    _next: function() { this.next.fire(); },
    _end: function() { this.end.fire(); },

    /*
     * Callback
     * -------------------------------------------------------------------------
     */

    update: function(dt) {}
  });

}(seine);
