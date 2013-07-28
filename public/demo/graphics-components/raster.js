!function(exports) {
  'use strict';

  function Raster(fr, image, textureId, x, y, w, h) {
    this._fr = fr;
    this._image = image;
    this._id = textureId;

    this.clipX = x;
    this.clipY = y;
    this.clipW = w;
    this.clipH = h;

    this.x = this.y = this.z;
    this.angle = 0;
    this.scale = 1;
  }

  Raster.prototype.render = function(x, y, z, mask) {
    this.shade(this._fr._canvas, this._fr._gl, this._fr._prog);
  };

  // Actually does the rendering. Overridable.
  Raster.prototype.shade = function(canvas, gl, prog) {
    drawScene(canvas, gl, prog, this._image, this.clipW, this.clipH);
  };


  function drawScene(canvas, gl, program, image, width, height) {
    var tex = texture(image, 0, 0, 48, 32);
    drawRect(canvas, gl, program, tex, 10, 10, 48*4, 32*4);
  }

  function drawRect(canvas, gl, program, tex, x, y, w, h) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    var resolutionLocation = gl.getUniformLocation(program, 'uResolution');
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.bufferData(gl.ARRAY_BUFFER, rectArray(x, y, w, h), gl.STATIC_DRAW);

    var positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);

    // (pointer, tuple size?, type, ?, ?, ?)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    //gl.disable(gl.DEPTH_TEST); // Only needed for 3D
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    var texCoordLocation = gl.getAttribLocation(program, 'aTexCoord');
    var texClipLocation = gl.getUniformLocation(program, 'uClip');
    gl.uniform4f(texClipLocation, tex.x, tex.y, tex.w, tex.h);
    var texSizeLocation = gl.getUniformLocation(program, 'uTexSize');
    gl.uniform2f(texSizeLocation, tex.image.width, tex.image.height);
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

    // note: can reuse same float32 array every time, no need to make garbage
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0
    ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);

    // (type, dunno, num tuples)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function texture(image, x, y, w, h) {
    return {
      image: image,
      x: x,
      y: y,
      w: w,
      h: h
    };
  }

  function rectArray(x, y, w, h) {
    // note: can overwrite same float32 array every time, as long as client
    // code is ok with that. maybe take in a float32 array and modify it?
    return new Float32Array([
      x, y,
      x, y + h,
      x + w, y,
      x + w, y + h
    ]);
  }

  exports.Raster = Raster;

}(demo);
