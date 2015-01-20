'use strict';

var compo = require('compo'),
    World = require('./world'),
    Engine = require('./engine'),
    StatSystem = require('./stats/system');

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

var image = new Image();
image.src = "/build/assets/level1.png";

image.onload = function() {
  World.build(engine, [image]);
  runner.start();
};
