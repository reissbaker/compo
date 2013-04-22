Engine should have dependency injection on the looping and running functions.
Provide realtime-tuned defaults if none are specified.


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

Could be done by overriding a filter in a component. Also async doesn't mean
callbacks necessarily: you could just push things that need to get removed into
a buffer, and then remove them all at once in the filter.

