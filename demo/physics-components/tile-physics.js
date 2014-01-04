!function(seine, exports) {
  'use strict';

  var System = seine.System,
      TilePhysicsComponent = demo.TilePhysicsComponent,
      CollisionGrid = demo.CollisionGrid,
      Collidable = exports.Collidable,
      Point = exports.Point,
      Rect = exports.Rect;

  var X_AXIS = 'x',
      X_DIMENSION = 'width',
      Y_AXIS = 'y',
      Y_DIMENSION = 'height';

  var TilePhysics = System.extend({
    observe: {
      tiles: TilePhysicsComponent,
      grids: CollisionGrid
    },
    update: function(delta) {
      var i, l,
          tiles = this.observe.tiles,
          grids = this.observe.grids;
      for(i = 0, l = tiles.length; i < l; i++) {
        attemptMove(delta, tiles[i], tiles, grids);
      }
    }
  });

  function attemptMove(delta, tile, tiles, grids) {
    if(tile.immovable) return;
    attempt(X_AXIS, X_DIMENSION, delta, tile, tiles, grids);
    attempt(Y_AXIS, Y_DIMENSION, delta, tile, tiles, grids);
  }

  // Don't reallocate this constantly
  var savedMovementHitbox = new Rect;
  function attempt(axis, dimension, delta, component, components, grids) {
    var collider,
        v = component.velocity[axis],
        h = component.collidable.hitbox,
        loc = component.collidable.loc,
        deltaSeconds = delta / 1000,
        absMove = Math.abs(v * deltaSeconds),
        positive = v > 0,
        xDir = positive ? 1 : (v === 0 ? 0 : -1),
        // left edge of a hitbox the size of the movement area
        startingEdge = positive ? h[axis] + h[dimension] : h[axis] - absMove;

    // hitbox the size of the movement area
    overwriteHitbox(savedMovementHitbox, h.x, h.y, h.width, h.height);
    savedMovementHitbox[axis] = startingEdge;
    savedMovementHitbox[dimension] = absMove;
    copyOffsetHitbox(savedMovementHitbox, savedMovementHitbox, loc);

    collider = collideAlong(
      axis, dimension, component, savedMovementHitbox, components, grids, xDir
    );
    resolve(axis, dimension, xDir, delta, component, collider);
  }

  function resolve(axis, dimension, dir, delta, component, collidable) {
    var max, notAccelerating, noGravity, hasVelocity, cL, cH,
        v = component.velocity,
        h = component.collidable.hitbox,
        a = component.acceleration,
        d = component.drag,
        g = component.gravity,
        m = component.maxVelocity,
        loc = component.collidable.loc,
        deltaSeconds = delta / 1000,
        movement = v[axis] * deltaSeconds,
        aDir = a[axis] > 0 ? 1 : (a[axis] < 0 ? -1 : 0);

    // No collider? Cool, move freely.
    if(!collidable) {
      max = m[axis] * deltaSeconds;
      loc[axis] += absClamp(movement, max);
      v[axis] = absClamp(
        v[axis] + (a[axis] * deltaSeconds) + (g[axis] * deltaSeconds),
        max
      );
      notAccelerating = (aDir === 0 || (aDir !== dir && dir !== 0));
      noGravity = g[axis] === 0;
      hasVelocity = v[axis] !== 0;
      if(notAccelerating && noGravity && hasVelocity) {
        v[axis] -= dir * d[axis] * deltaSeconds;
        if(dir === 1 && v[axis] < 0) v[axis] = 0;
        if(dir !== 1 && v[axis] > 0) v[axis] = 0;
      }
    } else {
      // Resolve the collision.
      cL = collidable.loc;
      cH = collidable.hitbox;
      if(dir === 1) loc[axis] = cL[axis] + cH[axis] - h[dimension];
      else loc[axis] = cL[axis] + cH[axis] + cH[dimension];
      v[axis] = 0;
    }
  }

  function absClamp(val, max) {
    if(val > max) return max;
    if(val < -max) return -max;
    return val;
  }

  /*
   * Given an axis, dimension, component, hitbox, set of components, a set of
   * grids, and a collision direction, returns the closests `Collidable` from
   * the set of components or grids that overlaps the given component.
   *
   * Oof. This thing could be refactored.
   */
  function collideAlong(axis, dim, component, hitbox, components, grids, dir) {
    var i, l, curr, minDistance, currDistance, startingEdge,
        min = null,
        colliders = collide(component, hitbox, components, grids);

    if(colliders.length === 0) return null;

    for(i = 0, l = colliders.length; i < l; i++) {
      curr = colliders[i];

      if(dir < 0) startingEdge = hitbox[axis];
      else startingEdge = hitbox[axis] + hitbox[dim];

      currDistance = directionalDistance(
        startingEdge,
        curr.hitbox[axis] + curr.loc[axis],
        curr.hitbox[dim],
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
  function collide(component, movementHitbox, components, grids) {
    var i, l, curr, collidable, grid, gridCollisions, g, gL,
        collidables = [];

    if(movementHitbox.width === 0 || movementHitbox.height === 0) {
      return collidables;
    }

    for(i = 0, l = components.length; i < l; i++) {
      curr = components[i];
      collidable = curr.collidable;
      copyOffsetHitbox(computedHitbox, collidable.hitbox, collidable.loc);

      if(component !== curr && doesCollide(movementHitbox, computedHitbox)) {
        collidables.push(curr.collidable);
      }
    }

    for(i = 0, l = grids.length; i < l; i++) {
      grid = grids[i];
      gridCollisions = gridCollide(movementHitbox, grid);
      for(g = 0, gL = gridCollisions.length; g < gL; g++) {
        collidables.push(gridCollisions[g]);
      }
    }

    return collidables;
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

    var startingRow = Math.floor(northOverlap / grid.tileSize.y),
        endingRow = Math.floor(southOverlap / grid.tileSize.y),
        startingCol = Math.floor(westOverlap / grid.tileSize.x),
        endingCol = Math.floor(eastOverlap / grid.tileSize.x);

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


  exports.tilePhysics = new TilePhysics;

}(seine, demo);
