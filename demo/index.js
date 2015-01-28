'use strict';

var compo = require('compo'),
    World = require('./world'),
    Engine = require('./engine'),
    StatSystem = require('./stats/system'),
    assetMap = require('./assets/map'),
    load = require('./assets/loader');

var kernel = new compo.Kernel(),
    runner = new compo.Runner(kernel, 30),
    engine = new Engine(kernel);

var camera = engine.renderer.camera;
camera.scale.x = camera.scale.y = 4;

var stats = new StatSystem();
stats.appendTo(document.body);
runner.on('beginFrame', function() { stats.before(); });
runner.on('endFrame', function() { stats.after(); });

window.demo = { runner: runner };

engine.endGame = function() {
  kernel.nextTick(function() {
    kernel.resetRoot();
    load(assetMap, function(err, assets) {
      World.build(engine, [assets.images.map]);
    });
  });
};

load(assetMap, function(err, assets) {
  if(!err) {
    World.build(engine, [assets.images.map]);
    runner.start();
  }
});
