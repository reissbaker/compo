'use strict';

var Point = require('../data/point');

function Camera() {
  // Does scale also belong to the camera? It kind of seems like it...
  // The camera should support "deadzoning" a la latest Flixel: have a bounding
  // box of tolerance in which the camera doesn't move, and only move when a
  // line of the bounding box is crossed.

  this.loc = new Point(0, 0);
  this.target = new Point(0, 0);
  this.lerp = { x: 0.01, y: 0.01 };
  this.bounds = { x: null, y: null, width: null, height: null };
}

Camera.prototype.setX = function(x) {
  var bounds = this.bounds,
      xNull = bounds.x === null,
      widthNull = bounds.width === null;

  if(xNull && widthNull) {
    this.target.x = x;
  } else {
    if(!xNull) this.target.x = Math.max(x, bounds.x);
    if(!widthNull) this.target.x = Math.min(x, bounds.width);
  }
};

Camera.prototype.getX = function() {
  return this.loc.x;
};

Camera.prototype.setY = function(y) {
  var bounds = this.bounds,
      yNull = bounds.y === null,
      heightNull = bounds.height === null;

  if(yNull && heightNull) {
    this.target.y = y;
  } else {
    if(!yNull) this.target.y = Math.max(y, bounds.y);
    if(!heightNull) this.target.y = Math.min(y, bounds.height);
  }
};

Camera.prototype.getY = function() {
  return this.loc.y;
};

Camera.prototype.update = function(delta) {
  // Note: replace with deadzoning. Or deadzoning + lerp?
  var loc = this.loc,
      lerp = this.lerp,
      target = this.target;

  if(lerp.x) loc.x = smootherstep(loc.x, target.x, delta * lerp.x);
  else loc.x = target.x;

  if(lerp.y) loc.y = smootherstep(loc.y, target.y, delta * lerp.y);
  else loc.y = target.y;
};

function smootherstep(a, b, t) {
  var t2 = t*t*t * (t * (6*t - 15) + 10);
  return lerp(a, b, t2);
}

function lerp(a, b, t) {
  if(t < 0) t = 0;
  if(t > 1) t = 1;
  return a + t * (b - a);
}

module.exports = Camera;
