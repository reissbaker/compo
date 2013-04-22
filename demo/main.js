!function(demo, seine) {
  'use strict';

  var engine = seine.engine;

  engine.components.push(demo.keyboard.component());
  engine.start(new demo.World);

}(demo, seine);
