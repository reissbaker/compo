Rather than binding to a global `engine.nextTick`, elements should have
`before` and `after` filters. These are run per-element rather than globally,
so you can be sure you're not accidentally leaking memory or dealing with
now-removed objects in a global filter.

Hm. In addition to `before` and `after` filters, also a `next` and `end`
function for one-offs.


Class heirarchy:

Runner
Runnable -> SceneNode
Runnable -> Component


Runnables and the engine have Queue instances with `next`, `end`, `_next`, and
`_end` methods. `_next` and `_end` run the queues, `next` and `end` enqueue.


Once queues are back in the engine and out of the Runner class, it might make
sense to fold Runner back into just a simple function -- or even some private
methods of the engine.


Rather than having the runner know about SceneNodes, the engine, etc, the
runner should just know about components. Additionally, there is a walker
function that collects all the components from the given tree.

Hmmm, dunno. Does that mean components can't take x, y, z coordinates as args
to their update methods? Once you've lost the tree structure you lose the
coords, or have to store them which makes for garbage.


Move geometry, rendering out to an abstracted non-scene-graph-based library.
Just a simple thing that can set up a canvas context, draw a bitmap, draw
shapes for rendering. For geometry, simple thing that can check collisions
between points, rects, circles. Maybe even a pure-functional collision
resolution library?

Once you have the functional geometry and rendering lib, build your components
on top of that.


All updates to position in physics module should be *async*. Not for some
imagined speed boost: for simplification. The state of the world should never
change: you just figure out what the next state should be.


Maybe not async: could be done by overriding a filter in a component. Also
async doesn't mean callbacks necessarily: you could just push things that need
to get removed into a buffer, and then remove them all at once in the filter.


