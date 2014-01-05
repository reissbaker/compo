!function(compo, exports) {
  'use strict';

  var Entity = compo.Entity,
      Keylogger = demo.Keylogger,
      Player = demo.Player,
      NPC = demo.NPC,
      Level = demo.Level,
      Matrix = exports.Matrix;

  var NUM_NPCS = 20;

  var World = Entity.extend({
    start: function() {
      var i, tile, matrix, level,
          numTiles = Math.ceil(document.body.clientWidth / 48);
      this.push(new Keylogger);

      matrix = new Matrix(2, numTiles, -1);
      for(i = 0; i < numTiles; i++) {
        matrix.set(1, i, 0);
      }
      matrix.set(0, numTiles - 1, 0);
      level = new Level(matrix);
      level.loc.y = 48 * 10;
      this.push(level);

      for(i = 0; i < NUM_NPCS; i++) {
        this.push(new NPC);
      }

      this.push(new Player);
    }
  });

  exports.World = World;

}(compo, demo);
