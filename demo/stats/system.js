'use strict';

var compo = require('compo');

var StatSystem = compo.extend(compo.System, function() {
  this.stats = new Stats();
  this.stats.domElement.style.position = 'absolute';
  this.stats.domElement.style.left = '0px';
  this.stats.domElement.style.top = '0px';
});

StatSystem.prototype.appendTo = function(el) {
  el.appendChild(this.stats.domElement);
};

StatSystem.prototype.before = function() {
  this.stats.begin();
};

StatSystem.prototype.after = function() {
  this.stats.end();
};

module.exports = StatSystem;

