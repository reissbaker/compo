'use strict';

var compo = require('compo'),
    World = require('./world'),
    Engine = require('./engine'),
    StatSystem = require('./stats/system');

var kernel = new compo.Kernel(),
    runner = new compo.Runner(kernel, 30),
    engine = new Engine(kernel);

engine.renderer.scale.x = engine.renderer.scale.y = 3;

var stats = new StatSystem();
stats.appendTo(document.body);
runner.on('beginFrame', function() { stats.before(); });
runner.on('endFrame', function() { stats.after(); });

World.build(engine);

window.demo = { runner: runner };

runner.start();
