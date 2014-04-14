'use strict';

var Component = require('../../core/component'),
    RunQueue = require('../../util/runqueue');

module.exports = Component.extend({
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
