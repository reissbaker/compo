!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Controller = exports.NodeKeyboardController,
      PositionLogger = exports.PositionLogger,
      Graphics = exports.Graphics,
      Dimension = exports.Dimension,
      Direction = exports.Direction,
      Position = exports.Position;

  var Player = Component.extend({
    constructor: function() {
      Component.call(this);

      this.pos = new Position;
      this.dir = new Direction;
      this.dim = new Dimension(48, 32);
    },
    init: function() {
      this.push(new Controller(this));
      this.push(new PositionLogger(this));
      this.push(new Graphics(this.pos, this.dir, '/swordguy.png', {
        x: 0, y: 0, width: 48, height: 32
      }));
    }
  });


  exports.Player = Player;

}(seine, demo);
