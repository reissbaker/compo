'use strict';

function Direction(x, y) {
  this.x = x || Direction.RIGHT;
  this.y = y || Direction.UP;
};

Direction.LEFT = -1;
Direction.RIGHT = 1;
Direction.DOWN = -1;
Direction.UP = 1;

module.exports = Direction;

