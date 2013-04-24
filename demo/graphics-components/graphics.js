!function(exports, seine) {
  'use strict';

  var Component = seine.Component;

  var canvas, ctx, className,
      component = new Component;

  component.init = function() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('experimental-webgl');

    canvas.classList.add(className);

    document.body.appendChild(canvas);
  };

  component.destroy = function() {
    canvas = ctx = null;
  };

  demo.graphics = {
    init: function(canvasClassName) {
      className = canvasClassName;
      seine.engine.components.push(component);
    }
  };

}(demo, seine);
