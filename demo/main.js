!function(demo, seine) {
  'use strict';

  var engine = seine.engine,
      graphics = demo.graphics;

  graphics.init();
  engine.components.push(demo.keyboard.component());
  engine.start(new demo.World);

}(demo, seine);
