!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Rect = exports.Rect,
      Point = exports.Point;

  var PhysicsComponent = Component.extend({
    constructor: function(hitbox) {
      Component.call(this);

      this.hitbox = hitbox;

      this.velocity = new Point;
      this.maxVelocity = new Point;
      this.acceleration = new Point;
      this.drag = new Point;
      this.gravity = new Point;

      this.immovable = false;
    },

    init: function() { physics.register(this); },
    destroy: function() { physics.unregister(this); }
  });


  var physicsComponents = [],
      component = new Component;

  component.update = function(delta) {
    for(var i = 0, l = physicsComponents.length; i < l; i++) {
      attemptMove(delta, physicsComponents[i], physicsComponents);
    }
  };

  var physics = {
    register: function(component) {
      physicsComponents.push(component);
    },
    unregister: function(component) {
      for(var i = 0, l = physicsComponents.length; i < l; i++) {
        if(physicsComponents[i] === component) {
          physicsComponents.splice(i, 1);
          return;
        }
      }
    },
    component: component
  };

  function attemptMove(delta, component, components) {
    if(component.immovable) return;
    attemptX(delta, component, components);
    attemptY(delta, component, components);
  }

  function attemptX(delta, component, components) {
    var a = component.acceleration,
        d = component.drag,
        v = component.velocity,
        h = component.hitbox,
        m = component.maxVelocity,
        g = component.gravity,
        deltaSeconds = delta / 1000,
        movement = v.x * deltaSeconds,
        movingRight = v.x > 0,
        xDir = movingRight ? 1 : -1,
        // left edge of a hitbox the size of the movement area
        leftEdge = movingRight ? h.x + h.width : h.x - movement,
        // hitbox the size of the movement area
        movementHitbox = new Rect(leftEdge, h.y, movement, h.height),
        collider = collideAlongX(component, movementHitbox, components, xDir);

    // No collider? Cool, move freely.
    if(!collider) {
      h.x += movement;
      v.x = absClamp(v.x + (a.x * deltaSeconds) + (g.x * deltaSeconds), m.x);
      if(a.x === 0 && g.x === 0 && v.x !== 0) {
        v.x -= xDir * d.x * deltaSeconds;
        if(movingRight && v.x < 0) v.x = 0;
        if(!movingRight && v.x > 0) v.x = 0;
      }
    } else {
      // Resolve the collision.
      if(movingRight) h.x = collider.hitbox.x - h.width;
      else h.x = collider.hitbox.x + collider.hitbox.width;
      v.x = 0;
    }
  }

  function attemptY(delta, component, components) {
    var a = component.acceleration,
        d = component.drag,
        v = component.velocity,
        h = component.hitbox,
        m = component.maxVelocity,
        g = component.gravity,
        deltaSeconds = delta / 1000,
        movement = v.y * deltaSeconds,
        movingDown = v.y > 0,
        yDir = movingDown ? 1 : -1,
        // top edge of a hitbox the size of the movement area
        topEdge = movingDown ? h.y + h.height : h.y - movement,
        // hitbox the size of the movement area
        movementHitbox = new Rect(h.x, topEdge, h.width, movement),
        // collider candidate set
        collider = collideAlongY(component, movementHitbox, components, yDir);

    // No collider? Cool, move freely.
    if(!collider) {
      h.y += movement;
      v.y = absClamp(v.y + (a.y * deltaSeconds) + (g.y * deltaSeconds), m.y);
      if(a.y === 0 && g.y === 0 && v.y !== 0) {
        v.y -= yDir * d.y * deltaSeconds;
        if(movingDown && v.y < 0) v.y = 0;
        if(!movingDown && v.y > 0) v.y = 0;
      }
    } else {
      // Resolve the collision.
      if(movingDown) h.y = collider.hitbox.y - h.height;
      else h.y = collider.hitbox.y + collider.hitbox.height;
      v.y = 0;
    }
  }

  function absClamp(val, max) {
    if(val > max) return max;
    if(val < -max) return -max;
    return val;
  }

  function collideAlongX(component, movementHitbox, components, dir) {
    var i, l, curr, minDistance, currDistance,
        min = null,
        colliders = collide(component, movementHitbox, components);
    if(colliders.length === 0) return null;

    for(i = 0, l = colliders.length; i < l; i++) {
      curr = colliders[i];
      currDistance = directionalDistance(
        dir < 0 ? movementHitbox.x : movementHitbox.x + movementHitbox.width,
        curr.x,
        curr.width,
        dir
      );
      if(min === null || currDistance < minDistance) {
        min = curr;
        minDistance = currDistance;
      }
    }

    return min;
  }

  function collideAlongY(component, movementHitbox, components, dir) {
    var i, l, curr, minDistance, currDistance,
        min = null,
        colliders = collide(component, movementHitbox, components);
    if(colliders.length === 0) return null;

    for(i = 0, l = colliders.length; i < l; i++) {
      curr = colliders[i];
      currDistance = directionalDistance(
        dir < 0 ? movementHitbox.y : movementHitbox.y + movementHitbox.height,
        curr.y,
        curr.height,
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
  function collide(component, movementHitbox, components) {
    var i, l, curr,
        colliders = [];

    if(movementHitbox.width === 0 || movementHitbox.height === 0) {
      return colliders;
    }

    for(i = 0, l = components.length; i < l; i++) {
      curr = components[i];
      if(component !== curr && doesCollide(movementHitbox, curr.hitbox)) {
        colliders.push(curr);
      }
    }

    return colliders;
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

  exports.tilePhysics = physics;
  exports.TilePhysicsComponent = PhysicsComponent;

}(seine, demo);
