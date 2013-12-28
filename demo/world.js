!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Keylogger = demo.Keylogger,
      Player = demo.Player,
      NPC = demo.NPC,
      Tile = demo.Tile;

  var World = Component.extend({
    init: function() {
      var i, tile,
          numTiles = Math.ceil(document.body.clientWidth / 48);
      this.push(new Keylogger);

      for(i = 0; i < numTiles; i++) {
        tile = new Tile;
        tile.hitbox.y = 48 * 10;
        tile.hitbox.x = i * 48;
        this.push(tile);
      }

      for(i = 0; i < 20; i++) {
        this.push(new NPC);
      }

      this.push(new Player);
    }
  });

  exports.World = World;

}(seine, demo);
