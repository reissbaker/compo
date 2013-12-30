!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Keylogger = demo.Keylogger,
      Player = demo.Player,
      NPC = demo.NPC,
      Tile = demo.Tile;

  var NUM_NPCS = 20;

  var World = Component.extend({
    init: function() {
      var i, tile,
          numTiles = Math.ceil(document.body.clientWidth / 48);
      this.push(new Keylogger);

      for(i = 0; i < numTiles; i++) {
        tile = new Tile;
        tile.loc.y = 48 * 10;
        tile.loc.x = i * 48;
        this.push(tile);
      }

      tile = new Tile;
      tile.loc.y = 48 * 9;
      tile.loc.x = (numTiles - 1) * 48;
      this.push(tile);

      for(i = 0; i < NUM_NPCS; i++) {
        this.push(new NPC);
      }

      this.push(new Player);
    }
  });

  exports.World = World;

}(seine, demo);
