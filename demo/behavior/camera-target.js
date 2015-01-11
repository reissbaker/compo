'use strict';

var compo = require('compo');

var CameraTarget = compo.extend(compo.Behavior, function(engine, target) {
  compo.Behavior.call(this);
  this.engine = engine;
  this.target = target;
});

CameraTarget.prototype.update = function(delta) {
  var camera = this.engine.renderer.camera;
  camera.moveToCenterOn(this.target.x, this.target.y);
};

module.exports = CameraTarget;
