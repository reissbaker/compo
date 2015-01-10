'use strict';

var PIXI = window.PIXI,
    Point = require('../data/point'),
    Rect = require('../data/rect');

function Clip(options) {
  this.pos = options.position;
  this.dir = options.direction || new Point(1, 1);
  this.offset = options.offset || new Point(0, 0);

  this.elapsed = 0;
  this.frameIndex = 0;
  this.frameTime = options.frameTime;
  this.numFrames = options.numFrames;

  this.loops = {};
  this.currentLoop = null;
  this.looping = false;
  this.stopped = true;

  var x, y,
      count = 0,
      numFrames = options.numFrames,
      texes = [],
      base = PIXI.BaseTexture.fromImage(options.url, false, PIXI.scaleModes.NEAREST),
      slice = options.crop || new Rect(0, 0, base.width, base.height),
      frameWidth = options.width,
      frameHeight = options.height;


  if(!numFrames) {
    var numX = slice.width / frameWidth,
        numY = slice.height / frameHeight;
    numFrames = numX * numY;
  }

  for(y = 0; y < slice.height && count < numFrames; y += frameHeight) {
    for(x = 0; x < slice.width && count < numFrames; x += frameWidth) {
      texes.push(new PIXI.Texture(base, {
        x: x,
        y: y,
        width: frameWidth,
        height: frameHeight
      }));

      count++;
    }
  }

  this.midpoint = options.midpoint || new Point(frameWidth / 2, frameHeight / 2);
  this.sprite = new PIXI.MovieClip(texes);
}

Clip.prototype.defineLoop = function(name, frameArray) {
  this.loops[name] = frameArray;
};

Clip.prototype.playLoop = function(name) {
  beginPlaying(this, name);
  this.looping = true;
};

Clip.prototype.playAndStop = function(name) {
  beginPlaying(this, name);
  this.looping = false;
};

function beginPlaying(clip, name) {
  clip.currentLoop = name;
  clip.frameIndex = 0;
  clip.stopped = false;
}

Clip.prototype.render = function(camera, scale, delta) {
  var frames,
      gPos = this.sprite.position,
      gScale = this.sprite.scale;

  gPos.x = (-camera.x + this.pos.x + this.offset.x) * scale.x;
  gPos.y = (-camera.y + this.pos.y + this.offset.y) * scale.y;

  gScale.x = this.dir.x * scale.x;
  gScale.y = this.dir.y * scale.y;

  /*
   * Flipping will result in the sprite appearing to jump (flips on the 0,
   * rather than mid-sprite), so add the sprite's midpoint * 2 to the current
   * position.
   */

  if(gScale.x < 0) gPos.x += this.midpoint.x * 2 * scale.x;
  if(gScale.y < 0) gPos.y += this.midpoint.y * 2 * scale.y;

  if(!this.currentLoop) return;

  frames = this.loops[this.currentLoop];
  this.elapsed += delta;
  while(this.elapsed > this.frameTime) {
    this.elapsed -= this.frameTime;
    if(this.looping) this.frameIndex = (this.frameIndex + 1) % frames.length;
    else if(this.frameIndex < frames.length - 1) this.frameIndex++;
    else this.stopped = true;
  }
  this.sprite.gotoAndStop(frames[this.frameIndex]);
};

module.exports = Clip;
