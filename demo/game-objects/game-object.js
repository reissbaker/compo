!function(compo, exports) {
  'use strict';

  var entity = compo.entity,
      Position = exports.Position,
      Rect = exports.Rect,
      Direction = exports.Direction;

  exports.GameObject = entity.define({
    init: function(x, y, width, height) {
      this.loc = new Position;
      this.hitbox = new Rect(x, y, width, height);
      this.dir = new Direction;
    }
  });

}(compo, demo);
