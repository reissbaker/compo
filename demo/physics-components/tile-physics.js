!function(seine, exports) {
  'use strict';

  var System = seine.System,
      TilePhysicsComponent = demo.TilePhysicsComponent,
      Rect = exports.Rect;

  var X_AXIS = 'x',
      X_DIMENSION = 'width',
      Y_AXIS = 'y',
      Y_DIMENSION = 'height';

  var TilePhysics = System.extend({
    observe: {
      children: TilePhysicsComponent
    },
    update: function(delta) {
      var i, l,
          children = this.observe.children;
      for(i = 0, l = children.length; i < l; i++) {
        attemptMove(delta, children[i], children);
      }
    }
  });

  function attemptMove(delta, tile, tiles) {
    if(tile.immovable) return;
    attempt(X_AXIS, X_DIMENSION, delta, tile, tiles);
    attempt(Y_AXIS, Y_DIMENSION, delta, tile, tiles);
  }

  // Don't reallocate this constantly
  var savedMovementHitbox = new Rect;
  function attempt(axis, dimension, delta, component, components) {
    var collider,
        v = component.velocity[axis],
        h = component.hitbox,
        loc = component.loc,
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
      axis, dimension, component, savedMovementHitbox, components, xDir
    );
    resolve(axis, dimension, xDir, delta, component, collider);
  }

  function resolve(axis, dimension, dir, delta, component, collider) {
    var max, notAccelerating, noGravity, hasVelocity, cL, cH,
        v = component.velocity,
        h = component.hitbox,
        a = component.acceleration,
        d = component.drag,
        g = component.gravity,
        m = component.maxVelocity,
        loc = component.loc,
        deltaSeconds = delta / 1000,
        movement = v[axis] * deltaSeconds,
        aDir = a[axis] > 0 ? 1 : (a[axis] < 0 ? -1 : 0);

    // No collider? Cool, move freely.
    if(!collider) {
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
      cL = collider.loc;
      cH = collider.hitbox;
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

  function collideAlong(axis, dimension, component, hitbox, components, dir) {
    var i, l, curr, minDistance, currDistance, startingEdge,
        min = null,
        colliders = collide(component, hitbox, components);

    if(colliders.length === 0) return null;

    for(i = 0, l = colliders.length; i < l; i++) {
      curr = colliders[i];

      if(dir < 0) startingEdge = hitbox[axis];
      else startingEdge = hitbox[axis] + hitbox[dimension];

      currDistance = directionalDistance(
        startingEdge,
        curr.hitbox[axis] + curr.loc[axis],
        curr.hitbox[dimension],
        dir
      );

      if(min === null || currDistance < minDistance) {
        min = curr;
        minDistance = currDistance;
      }
    }

    return min;
  }


  // Given a movement hitbox and a set of components, returns the subset of
  // components that collide with the hitbox.
  var computedHitbox = new Rect;
  function collide(component, movementHitbox, components) {
    var i, l, curr,
        colliders = [];

    if(movementHitbox.width === 0 || movementHitbox.height === 0) {
      return colliders;
    }

    for(i = 0, l = components.length; i < l; i++) {
      curr = components[i];
      copyOffsetHitbox(computedHitbox, curr.hitbox, curr.loc);

      if(component !== curr && doesCollide(movementHitbox, computedHitbox)) {
        colliders.push(curr);
      }
    }

    return colliders;
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


  exports.tilePhysics = new TilePhysics;

}(seine, demo);
