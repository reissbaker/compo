!function(demo, seine) {
  'use strict';

  var Kernel = seine.core.Kernel,
      renderer = demo.renderer,
      Collection = seine.core.Collection;

  var TestWorld = Collection.extend({
    init: function() {
      this.logged = false;
      console.log('initializing');
    },
    update: function(dt) {
      if(!this.logged) {
        this.logged = true;
        console.log('updated with', dt);
      }
    }
  });

  setTimeout(function() {
    //engine.overlay.push(renderer);
    //engine.after.push(demo.tilePhysics.component);
    //engine.after.push(demo.keyboard.component);

    //engine.init(new demo.World);
    var kernel = new Kernel(TestWorld);
    kernel.init();
  }, 0);

}(demo, seine);
