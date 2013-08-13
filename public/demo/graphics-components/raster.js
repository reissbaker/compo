/*
 * If you use WebGL Inspector you'll see in the trace if you do any unnecessary
 * GL instructions (they're marked with bright yellow background). This might
 * give you an idea on how to optimize your rendering.
 *
 * Generally speaking, sort your draw calls so all using the same program, then
 * attributes, then textures and then uniforms are done in order. This way
 * you'll have as few GL instructions (and JS instructions) as possible.
 *
 * http://stackoverflow.com/questions/15561871/the-fastest-way-to-batch-calls-in-webgl
 *
 *
 * Okay. This sounds like just making a tree:
 *
 *           (program)
 *          /         \
 *       (attr)      (attr)
 *        / \          |
 *     (tex)(tex)    (tex)
 *      | |   |       | |
 *      u u   u       u u
 *
 * Trees have a root node that points to potentially multiple programs. The
 * leaves (uniforms) have arrays of Raster objects that want to render this
 * frame.
 */

!function(exports) {
  'use strict';

  var FILL_ALL_VERTICES = new Float32Array([
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0
  ]);
  var TOP_LEFT_X = 0,
      TOP_LEFT_Y = 1,
      BOTTOM_LEFT_X = 2,
      BOTTOM_LEFT_Y = 3,
      BOTTOM_RIGHT_X = 4,
      BOTTOM_RIGHT_Y = 5,
      TOP_RIGHT_X = 6,
      TOP_RIGHT_Y = 7;

  function Raster(fr, image, textureId, x, y, w, h) {
    this._fr = fr;
    this._image = image;
    this._id = textureId;

    this.points = rectArray(x, y, w, h);

    this.clipX = x;
    this.clipY = y;
    this.clipW = w;
    this.clipH = h;

    this.angle = 0;
    this.scale = 1; // note: scale should end up affecting x,y position
  }

  Raster.prototype.setWidth = function(num) {
    var x = this.points[TOP_RIGHT_X];
    this.points[TOP_RIGHT_X] = this.points[BOTTOM_RIGHT_X] = num + x;
  };

  Raster.prototype.getWidth = function() {
    var x = this.points[TOP_LEFT_X];
    return this.points[TOP_RIGHT_X] - x;
  };
  Raster.prototype.width = function(num) {
    if(num != null) {
      this.setWidth(num);
      return num;
    }
    return this.getWidth();
  };

  Raster.prototype.setHeight = function(num) {
    var y = this.points[TOP_LEFT_Y];
    this.points[BOTTOM_LEFT_Y] = this.points[BOTTOM_RIGHT_Y] = num + y;
  };

  Raster.prototype.getHeight = function() {
    var y = this.points[TOP_LEFT_Y];
    return this.points[BOTTOM_LEFT_Y] - y;
  };

  Raster.prototype.height = function(num) {
    if(num != null) {
      this.setHeight(num);
      return num;
    }
    return this.getHeight();
  };

  Raster.prototype.setX = function(num) {
    var w = this.getWidth();

    this.points[TOP_LEFT_X] = this.points[BOTTOM_LEFT_X] = num;
    this.points[TOP_RIGHT_X] = this.points[BOTTOM_RIGHT_X] = num + h;
  };

  Raster.prototype.getX = function() {
    return this.points[TOP_LEFT_X];
  };

  Raster.prototype.x = function(num) {
    if(num != null) {
      this.setX(num);
      return num;
    }
    return this.getX();
  };

  Raster.prototype.setY = function(num) {
    var h = this.getHeight();

    this.points[TOP_LEFT_Y] = this.points[TOP_RIGHT_Y] = num;
    this.points[BOTTOM_LEFT_Y] = this.points[BOTTOM_RIGHT_Y] = num + h;
  };

  Raster.prototype.getY = function(num) {
    return this.points[TOP_LEFT_Y];
  };

  Raster.prototype.y = function(num) {
    if(num != null) {
      this.setY(num);
      return num;
    }
    return this.getY();
  };


  Raster.prototype.render = function(x, y, z, mask) {
    this.shade(this._fr._canvas, this._fr._gl, this._fr._prog);
  };

  // Actually does the rendering. Overridable.
  Raster.prototype.shade = function(canvas, gl, prog) {
    drawScene(canvas, gl, prog, this);
  };


  function drawScene(canvas, gl, program, raster) {
    gl.enable(gl.BLEND);
    //gl.disable(gl.DEPTH_TEST); // Only needed for 3D

    sendVertices(canvas, gl, program, raster.points);
    sendTexture(
      canvas, gl, program,
      raster._image, raster.clipX, raster.clipY, raster.clipW, raster.clipH
    );

    // (type, dunno, num tuples)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function sendVertices(canvas, gl, program, points) {
    declareResolution(gl, program, canvas.width, canvas.height);
    bindVertexBuffer(gl);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
    configureVertices(gl, program);
  }

  function bindVertexBuffer(gl) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  }

  function declareResolution(gl, program, width, height) {
    var resolutionLocation = gl.getUniformLocation(program, 'uResolution');
    gl.uniform2f(resolutionLocation, width, height);
  }

  function configureVertices(gl, program) {
    var positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);

    // (index, size of vertex, type, normalize, stride, pointer to first value)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  }

  function sendTexture(canvas, gl, program, img, clipX, clipY, clipW, clipH) {
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    var texClipLocation = gl.getUniformLocation(program, 'uClip');
    gl.uniform4f(texClipLocation, clipX, clipY, clipW, clipH);

    var texSizeLocation = gl.getUniformLocation(program, 'uTexSize');
    gl.uniform2f(texSizeLocation, img.width, img.height);

    bufferTexture(gl);
    configureTexture(gl, program);

    declareTextureSource(gl, img);
  }

  function bufferTexture(gl) {
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, FILL_ALL_VERTICES, gl.STATIC_DRAW);
  }

  function configureTexture(gl, program) {
    var texCoordLocation = gl.getAttribLocation(program, 'aTexCoord');
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
  }

  function declareTextureSource(gl, img) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img
    );
  }

  function rectArray(x, y, w, h) {
    return new Float32Array([
      x, y,
      x, y + h,
      x + w, y,
      x + w, y + h
    ]);
  }

  exports.Raster = Raster;

}(demo);
