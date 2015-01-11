'use strict';

var Point = require('../data/point');

function Camera() {
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

  // Scale is awkward in here and makes it annoying to provide your own camera.
  // Move it out. The only reason it's in here is because the camera needs to
  // know the viewport size, but the renderer can be passed in on attach() and
  // the camera can query it about the viewport rather than the camera owning
  // the rendering scale.
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

  // Minimum amount of camera offset allowed from a given location to a target.
  this.smoothingEpsilon = new Point(0.5, 0.5);

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


/*
 * Movement
 * -----------------------------------------------------------------------------
 *
 * Smoothly moves the camera to the provided coordinates. Use these for in-game
 * camera motion; use the setters to set or reset the camera to exact points
 * without smoothing.
 */

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


/*
 * Setters
 * -----------------------------------------------------------------------------
 *
 * These snap the camera to exact coordinates. Note that they still obey the
 * camera bounds, so the camera may not go to the exact coordinate passed in if
 * the bounds disallow it.
 */

Camera.prototype.centerOn = function(x, y) {
  this.moveToCenterOn(x, y);
  snap(this);
};

Camera.prototype.set = function(x, y) {
  this.setX(x);
  this.setY(y);
};

Camera.prototype.setX = function(x) {
  this.moveToX(x);
  xSnap(this);
};


Camera.prototype.setY = function(y) {
  this.moveToY(y);
  ySnap(this);
};


function snap(camera) {
  xSnap(camera);
  ySnap(camera);
}

function xSnap(camera) {
  camera.loc.x = camera._target.x;
}

function ySnap(camera) {
  camera.loc.y = camera._target.y;
}


/*
 * Getters
 * -----------------------------------------------------------------------------
 */

Camera.prototype.getX = function() {
  return this.loc.x;
};

Camera.prototype.getY = function() {
  return this.loc.y;
};

Camera.prototype.update = function(delta) {
  // TODO: Replace with deadzoning. Or deadzoning + lerp?
  var smoothed,
      loc = this.loc,
      lerp = this.lerp,
      epsilon = this.smoothingEpsilon,
      target = this._target;

  if(lerp.x) {
    smoothed = smootherstep(loc.x, target.x, delta * lerp.x);
    loc.x = epsilonSnap(smoothed, target.x, epsilon.x);
  } else {
    loc.x = target.x;
  }

  if(lerp.y) {
    smoothed = smootherstep(loc.y, target.y, delta * lerp.y);
    loc.y = epsilonSnap(smoothed, target.y, epsilon.y);
  } else {
    loc.y = target.y;
  }
};

function epsilonSnap(current, target, epsilon) {
  if(Math.abs(target - current) < epsilon) return target;
  return current;
}

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
