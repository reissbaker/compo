'use strict';

var Point = require('../data/point');

function Camera() {
  // Does scale also belong to the camera? It kind of seems like it...

  // The camera should support "deadzoning" a la latest Flixel: have a bounding
  // box of tolerance in which the camera doesn't move, and only move when a
  // line of the bounding box is crossed.

  this.loc = new Point(0, 0);
  this._target = new Point(0, 0);
  this.bounds = {
    left: null,
    top: null,
    right: null,
    bottom: null
  };


  this._viewport = new Point(0, 0);
  this.scale = new Point(1, 1);

  this._el = null;
  var that = this;
  this._resizeHandler = function() {
    that._viewport.x = that._el.width;
    that._viewport.y = that._el.height;

    // Update target in case there are bounds overlaps
    that.setX(that._target.x);
    that.setY(that._target.y);
  };

  // These values are total BS.
  this.lerp = { x: 0.01, y: 0.01 };
}

Camera.prototype.attach = function(el) {
  this.detach();

  this._el = el;
  this._viewport.x = el.width;
  this._viewport.y = el.height;

  window.addEventListener('resize', this._resizeHandler);
};

Camera.prototype.detach = function() {
  this._el = null;
  this._viewport.x = 0;
  this._viewport.y = 0;

  window.removeEventListener('resize', this._resizeHandler);
};

Camera.prototype.viewportWidth = function() {
  return this._viewport.x / this.scale.x;
};

Camera.prototype.viewportHeight = function() {
  return this._viewport.y / this.scale.y;
};

Camera.prototype.moveToCenterOn = function(x, y) {
  var xCen = x - this.viewportWidth() / 2,
      yCen = y - this.viewportHeight() / 2;

  this.moveTo(xCen, yCen);
};

Camera.prototype.moveTo = function(x, y) {
  this.moveToX(x);
  this.moveToY(y);
};

Camera.prototype.moveToX = function(x) {
  var bounds = this.bounds,
      target = this._target,
      leftNull = bounds.left === null,
      rightNull = bounds.right === null;

  if(leftNull && rightNull) {
    target.x = x;
  } else {
    if(!leftNull) target.x = Math.max(x, bounds.left);
    if(!rightNull) target.x = Math.min(x, bounds.right - this.viewportWidth());
  }
};

Camera.prototype.moveToY = function(y) {
  var bounds = this.bounds,
      target = this._target,
      topNull = bounds.top === null,
      bottomNull = bounds.bottom === null;

  if(topNull && bottomNull) {
    target.y = y;
  } else {
    if(!topNull) target.y = Math.max(y, bounds.top);
    if(!bottomNull) target.y = Math.min(y, bounds.bottom - this.viewportHeight());
  }
};

Camera.prototype.getX = function() {
  return this.loc.x;
};

Camera.prototype.getY = function() {
  return this.loc.y;
};

Camera.prototype.update = function(delta) {
  // Note: replace with deadzoning. Or deadzoning + lerp?
  var loc = this.loc,
      lerp = this.lerp,
      target = this._target;

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
