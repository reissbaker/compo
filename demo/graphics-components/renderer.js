!function(compo, exports) {
  'use strict';

  var System = compo.System,
      Graphic = demo.Graphic;

  var Renderer = System.extend({
    observe: {
      children: Graphic
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
        child.sprites().forEach(function(s) { stage.addChild(s); });
      });
      this.onStop('children', function(child) {
        child.sprites().forEach(function(s) { stage.removeChild(s); });
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

}(compo, demo);
