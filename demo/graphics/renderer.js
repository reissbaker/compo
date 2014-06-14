'use strict';

var compo = require('compo'),
    System = compo.System;

var Renderer = compo.extend(System, function() {
  this.table = null;

  var width = document.body.clientWidth,
      height = document.body.clientHeight;

  var stage = this.stage = new PIXI.Stage;
  var renderer = this.renderer = new PIXI.WebGLRenderer(width, height);

  this._resizeHandler = function() {
    var width = document.body.clientWidth,
        height = document.body.clientHeight;
    renderer.resize(width, height);
  };

  renderer.view.classList.add('seine-demo');
});

Renderer.prototype.onAttach = function(db) {
  var table = this.table = db.table();

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

Renderer.prototype.render = function() {
  var i, l,
      children = this.table.getAttached();

  for(i = 0, l = children.length; i < l; i++) {
    children[i].render();
  }

  this.renderer.render(this.stage);
};

module.exports = new Renderer;

