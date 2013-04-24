!function(exports, seine) {
  'use strict';

  var Component = seine.Component;

  var canvas, ctx,
      component = new Component;

  component.init = function() {
    canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.left = canvas.style.top = '0';

    ctx = canvas.getContext('experimental-webgl');

    //document.appendChild(canvas);
  };

  component.destroy = function() {
    canvas = ctx = null;
  };

  demo.graphics = {
    init: function() {
      seine.engine.components.push(component);
    }
  };

}(demo, seine);
