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
