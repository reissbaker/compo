!function(exports) {
  'use strict';

  var TextureMap = exports.TextureMap;

  function FasterRaster() {
    var gl, vertex, fragment;

    this._map = new TextureMap;
    this._canvas =  document.createElement('canvas');
    this._gl = gl = initWebGl(this._canvas);

    vertex = getShader(gl, '2d-vertex-shader');
    fragment = getShader(gl, '2d-fragment-shader');

    this._prog = initProgram(gl, vertex, fragment);
  }

  FasterRaster.prototype.el = function() {
    return this._canvas;
  };

  FasterRaster.prototype.appendTo = function(el) {
    el.appendChild(this._canvas);
    this.updateSize();
  };

  FasterRaster.prototype.updateSize = function() {
    var canvas = this._canvas;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    if(this._gl) this._gl.viewport(0, 0, canvas.width, canvas.height);
  };

  FasterRaster.prototype.image = function(url, x, y, w, h, callback) {
  };

  FasterRaster.prototype.canvas = function(canvas, x, y, w, h, callback) {
  };

  FasterRaster.prototype.rect = function(w, h, callback) {
  };

  FasterRaster.prototype.ellipse = function(w, h, callback) {
  };

  FasterRaster.prototype.text = function(text, font, color, fill, callback) {
  };

  FasterRaster.prototype.clear = function() {
    var gl = this._gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  };

  
  function initWebGl(canvas) {
    return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  }

  function initProgram(gl, vertex, fragment) {
    var prog = gl.createProgram();
    gl.attachShader(prog, vertex);
    gl.attachShader(prog, fragment);
    gl.linkProgram(prog);

    if(!gl.getProgramParameter(prog, gl.LINK_STATUS)) alert('crap');
    gl.useProgram(prog);
    return prog;
  }

  function getShader(gl, id) {
    var shaderEl = document.getElementById(id);
    if(!shaderEl) return null;
    return compileShader(gl, shaderEl.text, shaderMapping(gl, shaderEl.type));
  }

  function compileShader(gl, source, type) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;

    return shader;
  }

  function shaderMapping(gl, type) {
    switch(type) {
      case 'x-shader/x-vertex': return gl.VERTEX_SHADER;
      case 'x-shader/x-fragment': return gl.FRAGMENT_SHADER;
    }
    return null;
  }


  exports.FasterRaster = FasterRaster;

}(demo);
