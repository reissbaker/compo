!function(exports) {
  'use strict';

  var TextureMap = exports.TextureMap,
      Raster = exports.Raster;

  var WEBGL_CTX = 'webgl',
      VENDOR_WEBGL_CTX = 'experimental-webgl';

  /*
   * Constructor
   * ---------------------------------------------------------------------------
   */

  /*
   * ### FasterRaster
   *
   * Creates a new FasterRaster instance. Each instance contains its own canvas
   * and WebGL context, and can be used as a factory to create Raster objects
   * that can render to its WebGL context.
   *
   * FasterRaster instances do not automatically add their canvas element to the
   * DOM. To add the canvas element to the DOM, either use the `appendTo()`
   * method defined on FasterRaster instances, or get the canvas element using
   * the `el()` method and call `updateSize()` once you've added the canvas
   * manually.
   */

  function FasterRaster() {
    var gl, vertex, fragment;

    this._map = new TextureMap;
    this._canvas =  document.createElement('canvas');
    this._gl = gl = initWebGl(this._canvas);

    vertex = getShader(gl, '2d-vertex-shader');
    fragment = getShader(gl, '2d-fragment-shader');

    this._prog = initProgram(gl, vertex, fragment);
  }

  /*
   * DOM Interface
   * ---------------------------------------------------------------------------
   */

  /*
   * ### el
   *
   * Returns the canvas element used by the instance for its WebGL context.
   */

  FasterRaster.prototype.el = FasterRaster.prototype.element = function() {
    return this._canvas;
  };


  /*
   * ### appendTo
   *
   * Appends the instance to a given DOM element and updates the instance's
   * size.
   */

  FasterRaster.prototype.appendTo = function(el) {
    el.appendChild(this._canvas);
    this.updateSize();
  };


  /*
   * ### updateSize
   *
   * Updates the instance's size, and the size of its WebGL context. You must
   * call this method if you manually add the canvas element to the DOM with the
   * `el()` method, rather than using `appendTo`.
   */

  FasterRaster.prototype.updateSize = function() {
    var canvas = this._canvas;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    if(this._gl) this._gl.viewport(0, 0, canvas.width, canvas.height);
  };


  /*
   * Raster Generation
   * ---------------------------------------------------------------------------
   */

  FasterRaster.prototype.image = function(img, x, y, w, h) {
    return new Raster(this, img, -1, x, y, w, h);
  };

  FasterRaster.prototype.canvas = function(canvas, x, y, w, h) {
  };

  FasterRaster.prototype.rect = function(color, w, h) {
  };

  FasterRaster.prototype.ellipse = function(color, w, h) {
  };

  FasterRaster.prototype.text = function(text, font, color, fill) {
  };


  /*
   * WebGL Manipulation
   * ---------------------------------------------------------------------------
   */

  /*
   * ### clear
   *
   * Clears the WebGL context.
   */

  FasterRaster.prototype.clear = function() {
    var gl = this._gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  };


  /*
   * WebGL Helper Functions
   * ---------------------------------------------------------------------------
   */

  /*
   * ### initWebGl
   *
   * Given a canvas element, returns a WebGL context obtained from the element.
   */

  function initWebGl(canvas) {
    return canvas.getContext(WEBGL_CTX) || canvas.getContext(VENDOR_WEBGL_CTX);
  }


  /*
   * ### initProgram
   *
   * Given a WebGL context, a vertex shader, and a fragment shader, returns a
   * WebGL program object created from the context and shaders.
   */

  function initProgram(gl, vertex, fragment) {
    var prog = gl.createProgram();
    gl.attachShader(prog, vertex);
    gl.attachShader(prog, fragment);
    gl.linkProgram(prog);

    if(!gl.getProgramParameter(prog, gl.LINK_STATUS)) alert('crap');
    gl.useProgram(prog);
    return prog;
  }


  /*
   * ### getShader
   *
   * Given a WebGL context and an id, returns a compiled shader taken from the
   * source code in the DOM with the specified id.
   */

  function getShader(gl, id) {
    var shaderEl = document.getElementById(id);
    if(!shaderEl) return null;
    return compileShader(gl, shaderEl.text, shaderMapping(gl, shaderEl.type));
  }


  /*
   * ### compileShader
   *
   * Given a WebGL context, shader source code, and the WebGL enum type of the
   * shader, compiles the shader.
   */

  function compileShader(gl, source, type) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;

    return shader;
  }


  /*
   * ### shaderMapping
   *
   * Given a WebGL context and a string shader type, returns the WebGL shader
   * enum for the given type.
   */

  function shaderMapping(gl, type) {
    switch(type) {
      case 'x-shader/x-vertex': return gl.VERTEX_SHADER;
      case 'x-shader/x-fragment': return gl.FRAGMENT_SHADER;
    }

    return null;
  }


  /*
   * Exports
   * ---------------------------------------------------------------------------
   */

  exports.FasterRaster = FasterRaster;

}(demo);
