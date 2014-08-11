Should make a separate QuadTree lib. The physics lib can use the QuadTree lib,
as can the rendering lib.


Data structures like Points, Rects, etc should probably be in userland. Not all
games need circles, or 3D points, or triangles, or convex shapes, etc. Could
have specialized geometry libraries which may or may not go along with
specialized physics / collision libraries (tile-based vs SAT vs 3D, etc). The
data structures aren't *needed* by the kernel, so it shouldn't dictate them;
you'll end up with userland geometry modules anyway, since even a fairly
standard set of core geometry primitives won't satisfy all use cases equally
well, and the functions you'd want to run on them would vary wildly.


Need to really take another look at the runloop stuff. It's a bit hairy at the
moment.


Rather than using singletons everywhere, you should create an Engine object
that has a kernel and the variety systems the game needs. Every game should
have something that extends the Engine class, and passes the engine object
around to the factories so that the factories don't need to use singletons (and
are thus more easily testable).

For example:

```typescript
class Engine {
  kernel: Kernel;
  constructor(kernel: Kernel) {
    this.kernel = kernel;
  }
}

// In client code
class Engine2D extends Engine {
  renderer: Renderer;
  physics: Physics;
  behavior: Behavior;
  input: InputSystem;

  constructor(kernel: Kernel) {
    super(kernel);

    // set up systems
  }
}

interface InputSystem {
  keyboard: System;
}
```

