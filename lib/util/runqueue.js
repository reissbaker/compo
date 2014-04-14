'use strict';

function RunQueue() {
  this._q = [];
}

RunQueue.prototype.enqueue = function(callback) {
  if(callback) this._q.push(callback);
};

RunQueue.prototype.fire = function() {
  var curr, index;
  for(index = this._q.length - 1; index >= 0; index--) {
    curr = this._q.shift();
    curr();
  }
};

module.exports = RunQueue;
