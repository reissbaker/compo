!function(seine, exports) {
  'use strict';

  var Component = seine.Component;

  var renderer = new Component;
  renderer.init = function() {
    var width = document.body.clientWidth,
        height = document.body.clientHeight;

    this.stage = new PIXI.Stage;
    var renderer = this.renderer = new PIXI.WebGLRenderer(width, height);

    window.addEventListener('resize', function() {
      var width = document.body.clientWidth,
          height = document.body.clientHeight;
      renderer.resize(width, height);
    });

    renderer.view.classList.add('seine-demo');
    document.body.appendChild(renderer.view);
  };

  renderer.render = function() {
    this.renderer.render(this.stage);
  };

  exports.renderer = renderer;

}(seine, demo);
