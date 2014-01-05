!function(demo, compo) {
  'use strict';

  var Kernel = compo.Kernel,
      keyboard = demo.keyboard,
      tilePhysics = demo.tilePhysics,
      renderer = demo.renderer,
      World = demo.World;

  setTimeout(function() {
    var kernel = new Kernel();
    kernel.register(keyboard);
    kernel.register(tilePhysics);
    kernel.register(renderer);
    kernel.start(new World);
  }, 0);

}(demo, compo);
