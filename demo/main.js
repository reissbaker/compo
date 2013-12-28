!function(demo, seine) {
  'use strict';

  var engine = seine.engine,
      renderer = demo.renderer;

  setTimeout(function() {
    engine.overlay.push(renderer);

    /*
    var raster, r2,
        fr = new FasterRaster;

    fr.el().classList.add('seine-demo');
    fr.appendTo(document.body);
    window.addEventListener('resize', function() {
      fr.updateSize();
      if(raster) raster.render();
      if(r2) r2.render();
    });

    var image = new Image;
    image.onload = function() {
      demo.raster = raster = fr.image(image, 0, 0, 48, 32);
      raster.scale = 4;
      raster.render();

      r2 = fr.image(image, 48, 0, 48, 32);
      r2.clipX += 48;
      r2.render();
    };
    image.src = '/swordguy.png';
    */

    engine.after.push(demo.tilePhysics.component);
    engine.after.push(demo.keyboard.component);
    engine.init(new demo.World);
  }, 0);

}(demo, seine);
