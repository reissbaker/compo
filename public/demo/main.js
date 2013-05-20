!function(demo, seine) {
  'use strict';

  var engine = seine.engine,
      graphics = demo.graphics,
      FasterRaster = demo.FasterRaster;

  //graphics.init('seine-demo');

  setTimeout(function() {
    var fr = new FasterRaster;
    fr.el().classList.add('seine-demo');
    fr.appendTo(document.body);
    window.addEventListener('resize', function() { fr.updateSize(); });

    engine.components.push(demo.keyboard.component());
    engine.start(new demo.World);
  }, 0);

}(demo, seine);
