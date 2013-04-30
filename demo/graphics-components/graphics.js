!function(exports, seine) {
  'use strict';

  var Component = seine.Component;

  var canvas, gl, className, prog,
      component = new Component;

  component.init = function() {
    var vertex, fragment, loc, buffer, res;

    canvas = document.createElement('canvas');

    canvas.classList.add(className);
    document.body.appendChild(canvas);

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    console.log(canvas.width, canvas.height);

    gl = initWebGl(canvas);

    vertex = getShader(gl, '2d-vertex-shader');
    fragment = getShader(gl, '2d-fragment-shader');

    prog = gl.createProgram();
    gl.attachShader(prog, vertex);
    gl.attachShader(prog, fragment);
    gl.linkProgram(prog);

    if(!gl.getProgramParameter(prog, gl.LINK_STATUS)) alert('crap');
    gl.useProgram(prog);

    window.addEventListener('resize', function() {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    });
  };

  component.preprocess = function() {
    clear(gl);
  };

  component.render = function() {
    drawScene(gl, prog, canvas.width, canvas.height);
  };

  component.destroy = function() {
    canvas = ctx = gl = prog = null;
  };

  function initWebGl(canvas) {
    return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  }

  function getShader(gl, id) {
    var source, shader,
        shaderEl = document.getElementById(id);

    if(!shaderEl) return null;
    source = shaderEl.text;

    shader = gl.createShader(shaderMapping(gl, shaderEl.type));
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

  function clear(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  function drawScene(gl, program, width, height) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    var resolutionLocation = gl.getUniformLocation(program, 'uResolution');
    gl.uniform2f(resolutionLocation, width, height);

    rect(gl, program, 10, 10, 70, 70);
  }

  function rect(gl, program, x, y, w, h, color) {
    gl.bufferData(gl.ARRAY_BUFFER, rectArray(x, y, w, h), gl.STATIC_DRAW);

    var positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);

    // (pointer, tuple size?, type, ?, ?, ?)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // (type, dunno, num tuples)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function rectArray(x, y, w, h) {
    return new Float32Array([
      x, y,
      x, y + h,
      x + w, y,
      x + w, y + h
    ]);
  }


  demo.graphics = {
    init: function(canvasClassName) {
      className = canvasClassName;
      seine.engine.components.push(component);
    }
  };

}(demo, seine);
