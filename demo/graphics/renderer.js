'use strict';

var compo = require('compo'),
    System = compo.System,
    Point = require('../data/point');

var Renderer = compo.extend(System, function() {
  this.table = null;
  this.stage = new PIXI.Stage(0x222222);
  this.scale = new Point(1, 1);
  this.camera = new Point(0, 0);

  var width = this._viewportWidth = document.body.clientWidth,
      height = this._viewportHeight = document.body.clientHeight;

  var renderer = this.renderer = new PIXI.WebGLRenderer(width, height);

  var that = this;
  this._resizeHandler = function() {
    var width = that._viewportWidth = document.body.clientWidth,
        height = that._viewportHeight = document.body.clientHeight;
    renderer.resize(width, height);
  };

  renderer.view.classList.add('seine-demo');
});

Renderer.prototype.viewportWidth = function() {
  return this._viewportWidth / this.scale.x;
};

Renderer.prototype.viewportHeight = function() {
  return this._viewportHeight / this.scale.y;
};

Renderer.prototype.onAttach = function(db) {
  var table = this.table = db.table(),
      stage = this.stage;

  table.on('attach', function(child) {
    child.sprites().forEach(function(s) { stage.addChild(s); });
  });
  table.on('detach', function(child) {
    child.sprites().forEach(function(s) { stage.removeChild(s); });
  });

  window.addEventListener('resize', this._resizeHandler);
  document.body.appendChild(this.renderer.view);
};

Renderer.prototype.onDetach = function(db) {
  db.drop(this.table);

  window.removeEventListener('resize', this._resizeHandler);
  document.body.removeChild(this.renderer.view);
};

Renderer.prototype.render = function(delta) {
  var i, l,
      children = this.table.getAttached();

  for(i = 0, l = children.length; i < l; i++) {
    children[i].render(this.camera, this.scale, delta);
  }

  this.renderer.render(this.stage);
};

module.exports = new Renderer;
