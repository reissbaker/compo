!function(demo, seine) {
  'use strict';

  var engine = seine.engine,
      FasterRaster = demo.FasterRaster;

  setTimeout(function() {
    var fr = new FasterRaster;
    fr.el().classList.add('seine-demo');
    fr.appendTo(document.body);
    window.addEventListener('resize', function() { fr.updateSize(); });

    var image = new Image;
    image.onload = function() {
      console.log('hi');
      var raster = fr.image(image, 0, 0, 0, 0);
      raster.render();
      console.log('rendered');
    };
    image.src = '/swordguy.png';

    engine.component.unshift(demo.keyboard.component());
    engine.init(new demo.World);
  }, 0);

}(demo, seine);
