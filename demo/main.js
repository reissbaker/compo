!function(demo, seine) {
  'use strict';

  var engine = seine.engine,
      renderer = demo.renderer;

  setTimeout(function() {
    engine.overlay.push(renderer);
    engine.after.push(demo.tilePhysics.component);
    engine.after.push(demo.keyboard.component);

    engine.init(new demo.World);
  }, 0);

}(demo, seine);
