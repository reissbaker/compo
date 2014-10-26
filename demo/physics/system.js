'use strict';

/*
 * Ugh, this is a mess. Known broken thing that's a pain to fix with the current
 * design: collision events may trigger twice for a given collision.
 */

var compo = require('compo'),
    Tile = require('./tile'),
    CollisionGrid = require('./grid'),
    Collidable = require('./collidable'),
    Point = require('../data/point'),
    Rect = require('../data/rect');

var X_AXIS = 'x',
    X_DIMENSION = 'width',
    Y_AXIS = 'y',
    Y_DIMENSION = 'height';

var TilePhysics = compo.extend(compo.System, function() {
  this.tiles = null;
  this.grids = null;
  this._typedColliders = {};
});

TilePhysics.prototype.onAttach = function(db) {
  this.tiles = db.table();
  this.grids = db.table();
};

TilePhysics.prototype.onDetach = function(db) {
  db.drop(this.tiles);
  db.drop(this.grids);
};

TilePhysics.prototype.restrictCollisions = function(type, types) {
  this._typedColliders[type] = types;
};

TilePhysics.prototype.update = function(delta) {
  var i, l,
      tiles = this.tiles.getAttached(),
      grids = this.grids.getAttached();

  for(i = 0, l = tiles.length; i < l; i++) {
    if(tiles[i]) {
      attemptMove(delta, tiles[i], tiles, grids, this._typedColliders);
    }
  }
};

function attemptMove(delta, tile, tiles, grids, typedColliders) {
  if(tile.immovable) return;
  attemptX(delta, tile, tiles, grids, typedColliders);
  attemptY(delta, tile, tiles, grids, typedColliders);
}

// Don't reallocate this constantly
var savedMovementHitbox = new Rect;
function attemptX(delta, component, components, grids, typedColliders) {
  var collider,
      v = absClamp(component.velocity.x, component.maxVelocity.x),
      h = component.collidable.hitbox,
      loc = component.collidable.loc,
      deltaSeconds = delta / 1000,
      absMove = Math.abs(v * deltaSeconds),
      positive = v > 0,
      xDir = positive ? 1 : (v === 0 ? 0 : -1),
      // left edge of a hitbox the size of the movement area
      startingEdge = positive ? h.x + h.width : h.x - absMove;

  if(!component.collidable.active) {
    resolveX(xDir, delta, component, null);
    return;
  }

  // hitbox the size of the movement area
  overwriteHitbox(savedMovementHitbox, h.x, h.y, h.width, h.height);
  savedMovementHitbox.x = startingEdge;
  savedMovementHitbox.width = absMove;
  copyOffsetHitbox(savedMovementHitbox, savedMovementHitbox, loc);

  collider = collideAlongX(
    component, savedMovementHitbox, components, grids, xDir, typedColliders
  );
  resolveX(xDir, delta, component, collider);
}

function resolveX(dir, delta, component, collidable) {
  var max, notAccelerating, noGravity, hasVelocity, cL, cH,
      v = component.velocity,
      h = component.collidable.hitbox,
      a = component.acceleration,
      d = component.drag,
      g = component.gravity,
      m = component.maxVelocity,
      loc = component.collidable.loc,
      deltaSeconds = delta / 1000,
      max = m.x * deltaSeconds,
      movement = absClamp(v.x, m.x) * deltaSeconds,
      aDir = a.x > 0 ? 1 : (a.x < 0 ? -1 : 0);

  // No collider? Cool, move freely.
  if(!collidable) {
    loc.x += absClamp(movement, max);
    v.x = absClamp(
      v.x + (a.x * deltaSeconds) + (g.x * deltaSeconds),
      m.x
    );
    notAccelerating = (aDir === 0 || (aDir !== dir && dir !== 0));
    noGravity = g.x === 0;
    hasVelocity = v.x !== 0;
    if(notAccelerating && noGravity && hasVelocity) {
      v.x -= dir * d.x * deltaSeconds;
      if(dir === 1 && v.x < 0) v.x = 0;
      if(dir !== 1 && v.x > 0) v.x = 0;
    }
  } else {
    // Resolve the collision.
    cL = collidable.loc;
    cH = collidable.hitbox;
    if(dir === 1) {
      loc.x = cL.x + cH.x - h.width - h.x;
      component.emitter.trigger('collide:right', null);
      collidable.emitter.trigger('collide:left', null);
    } else {
      loc.x = cL.x + cH.x + cH.width - h.x;
      component.emitter.trigger('collide:left', null);
      collidable.emitter.trigger('collide:right', null);
    }
    v.x = 0;
  }
}

function attemptY(delta, component, components, grids, typedColliders) {
  var collider,
      v = absClamp(component.velocity.y, component.maxVelocity.y),
      h = component.collidable.hitbox,
      loc = component.collidable.loc,
      deltaSeconds = delta / 1000,
      absMove = Math.abs(v * deltaSeconds),
      positive = v > 0,
      dir = positive ? 1 : (v === 0 ? 0 : -1),
      // left edge of a hitbox the size of the movement area
      startingEdge = positive ? h.y + h.height : h.y - absMove;

  if(!component.collidable.active) {
    resolveY(dir, delta, component, null);
    return;
  }

  // hitbox the size of the movement area
  overwriteHitbox(savedMovementHitbox, h.x, h.y, h.width, h.height);
  savedMovementHitbox.y = startingEdge;
  savedMovementHitbox.height = absMove;
  copyOffsetHitbox(savedMovementHitbox, savedMovementHitbox, loc);

  collider = collideAlongY(
    component, savedMovementHitbox, components, grids, dir, typedColliders
  );
  resolveY(dir, delta, component, collider);
}

function resolveY(dir, delta, component, collidable) {
  var max, notAccelerating, noGravity, hasVelocity, cL, cH,
      v = component.velocity,
      h = component.collidable.hitbox,
      a = component.acceleration,
      d = component.drag,
      g = component.gravity,
      m = component.maxVelocity,
      loc = component.collidable.loc,
      deltaSeconds = delta / 1000,
      max = m.y * deltaSeconds,
      movement = absClamp(v.y, m.y) * deltaSeconds,
      aDir = a.y > 0 ? 1 : (a.y < 0 ? -1 : 0);

  // No collider? Cool, move freely.
  if(!collidable) {
    loc.y += absClamp(movement, max);
    v.y = absClamp(
      v.y + (a.y * deltaSeconds) + (g.y * deltaSeconds),
      m.y
    );
    notAccelerating = (aDir === 0 || (aDir !== dir && dir !== 0));
    noGravity = g.y === 0;
    hasVelocity = v.y !== 0;
    if(notAccelerating && noGravity && hasVelocity) {
      v.y -= dir * d.y * deltaSeconds;
      if(dir === 1 && v.y < 0) v.y = 0;
      if(dir !== 1 && v.y > 0) v.y = 0;
    }
  } else {
    // Resolve the collision.
    cL = collidable.loc;
    cH = collidable.hitbox;
    if(dir === 1) {
      loc.y = cL.y + cH.y - h.height - h.y;
      component.emitter.trigger('collide:bottom', null);
      collidable.emitter.trigger('collide:top', null);
    } else {
      loc.y = cL.y + cH.y + cH.height - h.y;
      component.emitter.trigger('collide:top', null);
      collidable.emitter.trigger('collide:bottom', null);
    }
    v.y = 0;
  }
}

function absClamp(val, max) {
  if(val > max) return max;
  if(val < -max) return -max;
  return val;
}

/*
 * Given a component, hitbox, set of components, a set of
 * grids, and a collision direction, returns the closests `Collidable` from
 * the set of components or grids that overlaps the given component.
 *
 * Oof. This thing could be refactored.
 */
function collideAlongX(component, hitbox, components, grids, dir, typedColliders) {
  var i, l, curr, minDistance, currDistance, startingEdge,
      min = null,
      colliders = collide(component, hitbox, components, grids, typedColliders);

  if(colliders.length === 0) return null;

  for(i = 0, l = colliders.length; i < l; i++) {
    curr = colliders[i];
    if(!curr || !curr.active) continue;

    if(dir < 0) startingEdge = hitbox.x;
    else startingEdge = hitbox.x + hitbox.width;

    currDistance = directionalDistance(
      startingEdge,
      curr.hitbox.x + curr.loc.x,
      curr.hitbox.width,
      dir
    );

    if(min === null || currDistance < minDistance) {
      min = curr;
      minDistance = currDistance;
    }
  }

  return min;
}

function collideAlongY(component, hitbox, components, grids, dir, typedColliders) {
  var i, l, curr, minDistance, currDistance, startingEdge,
      min = null,
      colliders = collide(component, hitbox, components, grids, typedColliders);

  if(colliders.length === 0) return null;

  for(i = 0, l = colliders.length; i < l; i++) {
    curr = colliders[i];
    if(!curr || !curr.active) continue;

    if(dir < 0) startingEdge = hitbox.y;
    else startingEdge = hitbox.y + hitbox.height;

    currDistance = directionalDistance(
      startingEdge,
      curr.hitbox.y + curr.loc.y,
      curr.hitbox.height,
      dir
    );

    if(min === null || currDistance < minDistance) {
      min = curr;
      minDistance = currDistance;
    }
  }

  return min;
}


/*
 * Given a component, a movement hitbox, a set of components, and a set of
 * grids, returns the subset of collidables that collide with the given
 * component.
 */
var computedHitbox = new Rect;
function collide(component, movementHitbox, components, grids, typedColliders) {
  var i, l, curr, collidable, grid, gridCollisions, g, gL,
      collidables = [];

  if(movementHitbox.width === 0 || movementHitbox.height === 0) {
    return collidables;
  }

  for(i = 0, l = components.length; i < l; i++) {
    curr = components[i];
    if(!curr) continue;

    collidable = curr.collidable;
    if(!collisionAllowed(component.collidable, collidable, typedColliders)) {
      continue;
    }

    copyOffsetHitbox(computedHitbox, collidable.hitbox, collidable.loc);

    if(component !== curr && doesCollide(movementHitbox, computedHitbox)) {
      collidables.push(curr.collidable);
    }
  }

  for(i = 0, l = grids.length; i < l; i++) {
    grid = grids[i];
    if(!grid) continue;
    gridCollisions = gridCollide(movementHitbox, grid);
    for(g = 0, gL = gridCollisions.length; g < gL; g++) {
      collidable = gridCollisions[g];
      if(!collisionAllowed(component.collidable, collidable, typedColliders)) {
        continue;
      }
      collidables.push(collidable);
    }
  }

  return collidables;
}

function collisionAllowed(a, b, typedColliders) {
  return leftCollisionAllowed(a, b, typedColliders) &&
         leftCollisionAllowed(b, a, typedColliders);
}

function leftCollisionAllowed(a, b, typedColliders) {
  var types = typedColliders[a.type],
      target = b.type;
  if(!types) return true;
  for(var i = 0, l = types.length; i < l; i++) {
    if(types[i] === target) return true;
  }
  return false;
}


function overwriteHitbox(hitbox, x, y, width, height) {
  hitbox.x = x;
  hitbox.y = y;
  hitbox.width = width;
  hitbox.height = height;
}

function copyOffsetHitbox(dest, src, offset) {
  dest.x = offset.x + src.x;
  dest.y = offset.y + src.y;
  dest.width = src.width;
  dest.height = src.height;
}

function directionalDistance(a, b, offset, dir) {
  if(dir > 0) return b - a;
  return a - (b + offset);
}

// Given two hitboxes, returns true if they collide, false otherwise.
function doesCollide(a, b) {
  if(a.x + a.width <= b.x) return false;
  if(a.x >= b.x + b.width) return false;
  if(a.y + a.height <= b.y) return false;
  if(a.y >= b.y + b.height) return false;
  return true;
}

var tileHitbox = new Rect;
function gridCollide(hitbox, grid) {
  var collidables = [];
  if(!doesCollide(hitbox, grid.hitbox())) return collidables;

  var westOverlap = hitbox.x - grid.loc.x,
      northOverlap = hitbox.y - grid.loc.y,
      eastOverlap = hitbox.width + westOverlap,
      southOverlap = hitbox.height + northOverlap;

  var startingRow = (northOverlap / grid.tileSize.y) | 0,
      endingRow = (southOverlap / grid.tileSize.y) | 0,
      startingCol = (westOverlap / grid.tileSize.x) | 0,
      endingCol = (eastOverlap / grid.tileSize.x) | 0;

  if(startingRow < 0) startingRow = 0;
  if(startingCol < 0) startingCol = 0;
  if(endingRow >= grid.matrix.numRows) endingRow = grid.matrix.numRows - 1;
  if(endingCol >= grid.matrix.numCols) endingCol = grid.matrix.numCols - 1;

  for(var r = startingRow; r <= endingRow; r++) {
    for(var c = startingCol; c <= endingCol; c++) {
      var collidable = grid.collidable(r, c);
      if(collidable) {
        overwriteHitbox(
          tileHitbox,
          grid.loc.x + (c * grid.tileSize.x),
          grid.loc.y + (r *grid.tileSize.y),
          grid.tileSize.x,
          grid.tileSize.y
        );
        if(doesCollide(hitbox, tileHitbox)) collidables.push(collidable);
      }
    }
  }
  return collidables;
}


module.exports = new TilePhysics;

