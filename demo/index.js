'use strict';

var compo = require('compo'),
    World = require('./world'),
    behavior = require('./behavior/system'),
    keyboard = require('./input/keyboard'),
    physics = require('./physics/system'),
    renderer = require('./graphics/renderer'),
    StatSystem = require('./stats/system');

var kernel = new compo.Kernel(),
    runner = new compo.Runner(kernel),
    looper = new compo.Looper(function(delta) {
      runner.run(delta, 30);
    });

kernel.attach(behavior);
kernel.attach(keyboard);
kernel.attach(physics);
kernel.attach(renderer);

var stats = new StatSystem();
stats.appendTo(document.body);
kernel.attach(stats);

World.build(kernel);

window.demo = { looper: looper };

looper.start();
