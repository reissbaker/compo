!function(seine, exports) {
  'use strict';

  var System = seine.System,
      Graphics = demo.Graphics;

  var Renderer = System.extend({
    observe: {
      children: Graphics
    },

    init: function() {
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

      this.onStart('children', function(child) {
        stage.addChild(child.sprite);
      });
      this.onStop('children', function(child) {
        stage.removeChild(child.sprite);
      });
    },

    start: function() {
      window.addEventListener('resize', this._resizeHandler);
      document.body.appendChild(this.renderer.view);
    },
    stop: function() {
      window.removeEventListener('resize', this._resizeHandler);
      document.body.removeChild(this.renderer.view);
    },

    render: function() {
      var i, l,
          children = this.observe.children;

      for(i = 0, l = children.length; i < l; i++) {
        children[i].render();
      }

      this.renderer.render(this.stage);
    }
  });

  exports.renderer = new Renderer;

}(seine, demo);
