!function(compo, exports) {
  'use strict';

  var System = compo.System,
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
    attemptX(delta, tile, tiles, grids);
    attemptY(delta, tile, tiles, grids);
  }

  // Don't reallocate this constantly
  var savedMovementHitbox = new Rect;
  function attemptX(delta, component, components, grids) {
    var collider,
        v = component.velocity.x,
        h = component.collidable.hitbox,
        loc = component.collidable.loc,
        deltaSeconds = delta / 1000,
        absMove = Math.abs(v * deltaSeconds),
        positive = v > 0,
        xDir = positive ? 1 : (v === 0 ? 0 : -1),
        // left edge of a hitbox the size of the movement area
        startingEdge = positive ? h.x + h.width : h.x - absMove;

    // hitbox the size of the movement area
    overwriteHitbox(savedMovementHitbox, h.x, h.y, h.width, h.height);
    savedMovementHitbox.x = startingEdge;
    savedMovementHitbox.width = absMove;
    copyOffsetHitbox(savedMovementHitbox, savedMovementHitbox, loc);

    collider = collideAlongX(
      component, savedMovementHitbox, components, grids, xDir
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
        movement = v.x * deltaSeconds,
        aDir = a.x > 0 ? 1 : (a.x < 0 ? -1 : 0);

    // No collider? Cool, move freely.
    if(!collidable) {
      max = m.x * deltaSeconds;
      loc.x += absClamp(movement, max);
      v.x = absClamp(
        v.x + (a.x * deltaSeconds) + (g.x * deltaSeconds),
        max
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
      if(dir === 1) loc.x = cL.x + cH.x - h.width;
      else loc.x = cL.x + cH.x + cH.width;
      v.x = 0;
    }
  }

  function attemptY(delta, component, components, grids) {
    var collider,
        v = component.velocity.y,
        h = component.collidable.hitbox,
        loc = component.collidable.loc,
        deltaSeconds = delta / 1000,
        absMove = Math.abs(v * deltaSeconds),
        positive = v > 0,
        dir = positive ? 1 : (v === 0 ? 0 : -1),
        // left edge of a hitbox the size of the movement area
        startingEdge = positive ? h.y + h.height : h.y - absMove;

    // hitbox the size of the movement area
    overwriteHitbox(savedMovementHitbox, h.x, h.y, h.width, h.height);
    savedMovementHitbox.y = startingEdge;
    savedMovementHitbox.height = absMove;
    copyOffsetHitbox(savedMovementHitbox, savedMovementHitbox, loc);

    collider = collideAlongY(
      component, savedMovementHitbox, components, grids, dir
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
        movement = v.y * deltaSeconds,
        aDir = a.y > 0 ? 1 : (a.y < 0 ? -1 : 0);

    // No collider? Cool, move freely.
    if(!collidable) {
      max = m.y * deltaSeconds;
      loc.y += absClamp(movement, max);
      v.y = absClamp(
        v.y + (a.y * deltaSeconds) + (g.y * deltaSeconds),
        max
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
      if(dir === 1) loc.y = cL.y + cH.y - h.height;
      else loc.y = cL.y + cH.y + cH.height;
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
  function collideAlongX(component, hitbox, components, grids, dir) {
    var i, l, curr, minDistance, currDistance, startingEdge,
        min = null,
        colliders = collide(component, hitbox, components, grids);

    if(colliders.length === 0) return null;

    for(i = 0, l = colliders.length; i < l; i++) {
      curr = colliders[i];

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

  function collideAlongY(component, hitbox, components, grids, dir) {
    var i, l, curr, minDistance, currDistance, startingEdge,
        min = null,
        colliders = collide(component, hitbox, components, grids);

    if(colliders.length === 0) return null;

    for(i = 0, l = colliders.length; i < l; i++) {
      curr = colliders[i];

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


  exports.tilePhysics = new TilePhysics;

}(compo, demo);
