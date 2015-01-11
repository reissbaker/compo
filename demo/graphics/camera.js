'use strict';

var Point = require('../data/point');

function Camera() {
  // Does scale also belong to the camera? It kind of seems like it...

  // The camera should support "deadzoning" a la latest Flixel: have a bounding
  // box of tolerance in which the camera doesn't move, and only move when a
  // line of the bounding box is crossed.

  this.loc = new Point(0, 0);
  this.target = new Point(0, 0);
  this.bounds = {
    left: null,
    top: null,
    right: null,
    bottom: null
  };

  // These values are total BS.
  this.lerp = { x: 0.01, y: 0.01 };
}

Camera.prototype.setX = function(x) {
  var bounds = this.bounds,
      leftNull = bounds.left === null,
      rightNull = bounds.right === null;

  if(leftNull && rightNull) {
    this.target.x = x;
  } else {
    if(!leftNull) this.target.x = Math.max(x, bounds.left);
    if(!rightNull) this.target.x = Math.min(x, bounds.right);
  }
};

Camera.prototype.getX = function() {
  return this.loc.x;
};

Camera.prototype.setY = function(y) {
  var bounds = this.bounds,
      topNull = bounds.top === null,
      bottomNull = bounds.bottom === null;

  if(topNull && bottomNull) {
    this.target.y = y;
  } else {
    if(!topNull) this.target.y = Math.max(y, bounds.top);
    if(!bottomNull) this.target.y = Math.min(y, bounds.bottom);
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
