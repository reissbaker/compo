Oh damn, the root node shouldn't be the world: it should be the screen. That
way you can absolutely position things relative to the screen (by adding them
to the screen node), as well as the world.

No nevermind, just have things that ignore camera by percentages (including
zero).

fr -- faster raster
jenniferseinefr -- seine bindings to fr

Postprocess / after filters should run in this order:

* component
* children

If you want something to run AFTER all children, you can stick it in the before
filter. But if you want something to run in between render / postprocess, if
you don't stay consistent with ordering you're screwed.


Engine should have dependency injection on the looping and running functions.
Provide realtime-tuned defaults if none are specified.


Might want Component containers that call all the methods on components, and
that themselves are components that can be added to a SceneNode or engine. E.g.
if you have a series of powerups, you might want those to just be in a single
controller component, and have that component call different components
depending on its state.

NO: unnecessary. Just have an interface that owns a component. The exported
component provides the hooks; the main object controls the state. Components
are hooks.


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

On second or third thought, this is sort of silly. Really there should just be
one interface/object that controls all of physics and does a single update
step, with exportable physics components that get added to the engine and the
game components.
