Should rename to Compo, instead of Seine.


Right now, the DFTList runs all of the component functions -- even ones that
don't matter for a given component (e.g. the `render` function of a
PhysicsComponent, or the `update` function of a Hitbox). Using a
multidimensional DFTList (described in more detail at the top of the dftlist.js
file) would solve this.


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


The engine shouldn't be a singleton. It's sweet that multiple Coquette games
can be embedded into a single page without iframes; that's only possible
because Coquette avoids singletons. You should probably avoid singletons for
that reason in general: even the registrars should be individually
instantiated. You could make everything relate to a single Game object
(available automatically to all components?) so that registrants can find them.


Weird thought: remove the overridable `render`, `postprocess`, `preprocess`
methods: make those defined by the (userland!) rendering library. Often you
won't want to have every single component render (for example, if you have an
expensive-to-draw scene with straightforward game rules, you might want to only
render objects in the viewport but keep simulating a larger portion of the game
world), and if the individual rendering libs are going to define their own
versions of "render" that clash with the kernel's then screw it, why have it in
the kernel at all?

...Does this mean the multidimensional DFTList doesn't really matter anymore?
Would it actually bring much benefit as compared to the regular version,
considering the fact that nothing renders anymore? It probably wouldn't. Might
still be nice from the perspective of convincing everyone to always use
components rather than one-off data structures "for performance."

Maybe you should have a single `render` component (similar to the `before` and
`after` components) to ensure that rendering libs hook into the kernel in a
relatively consistent way. Also lets you keep the nice optimization of skipping
rendering until all updates have completed in the kernel, which is otherwise
fairly difficult to simulate in userland since there's no obvious way to tell
if the engine is going to immediately perform another update after the current
one or not.

Okay, here's how you can structure things for optimal performance / consistent
extension, while also keeping the abstraction space small:

1. Components. These have lifecycle methods (`init`, `start`, `finish`), a
   pointer to the kernel, and that's it (well, and an `extend` class method).
   Useful for storing data like health, animation frames, etc.
2. Services. These create Components and can imbue them with extra behavior,
   e.g. an overridable `render` or `update` method. Services get registered
   with the kernel and have IDs auto-generated for them on definition so that
   you can look them up by class later. You can also stick game data on them,
   e.g. score, since they're instantiated per-kernel.
3. Entities. These are actually components created from the EntityService. They
   can own Components (and, naturally, other Entities, since Entities are
   themselves Components). Entities have an `update` method that gets called on
   each tick of the game engine, and belong to a DFTList for easy, fast
   iteration with treelike insertion behavior. Also have `next` and `end`
   RunQueues, for lifecycle-safe out-of-main-loop updates. Note: since you need
   to pass the kernel object in for creation, you should probably have
   `pushNew`, `unshiftNew`, etc methods where you can just pass in a class and
   an options hash without having to manually pass the kernel around.
4. Kernel. This provides registration for Services, and runs the game loop. The
   Kernel provides four hooks for extension:
   1. The root entity. This is generally inaccessible, but calling `switchRoot`
      will safely switch the root out.
   2. The `before` entity.
   3. The `overlay` entity. This is essentially the root's root. Adding things
      to the `overlay` is like adding them to the root, except that they'll
      persist through `switchRoot` calls.
   4. The `after` entity.
   5. The `render` entity. This is essentially a hint to the kernel that
      entities here will only perform rendering duties. The default runloop
      takes advantage of this knowledge and only updates the `render` entity
      once per DOM-event-loop-run, and then only if the game's been updated, as
      opposed to every time the game ticks. Renderers should use the `render`
      entity to hook into the kernel for maximum performance. The `render`
      entity runs after the `after` entity if it runs at all.

Why do you need service registration on the kernel? Because you need services
to be per-kernel-instance, rather than singletons, in order for multiple games
to be able to be embedded on a single page.

The `extend` method shouldn't blindly copy class attributes: it should only
copy the `extend` method. ES6 classes don't support class methods, and you
don't want to write yourself into a corner on this: the library should be
compatible with ES6.
