'use strict';

var compo = require('compo'),
    World = require('./world'),
    behavior = require('./behavior/system'),
    keyboard = require('./input/keyboard'),
    physics = require('./physics/system'),
    renderer = require('./graphics/renderer'),
    StatSystem = require('./stats/system');

var kernel = new compo.Kernel(),
    runner = new compo.Runner(kernel, 30);

kernel.attach(keyboard);
kernel.attach(behavior);
kernel.attach(physics);
kernel.attach(renderer);

var stats = new StatSystem();
stats.appendTo(document.body);
runner.on('beginFrame', function() { stats.before(); });
runner.on('endFrame', function() { stats.after(); });

World.build(kernel);

window.demo = { runner: runner };

runner.start();
