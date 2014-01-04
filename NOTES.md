Should rename to Compo, instead of Seine.


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


The `extend` method shouldn't blindly copy class attributes: it should only
copy the `extend` method. ES6 classes don't support class methods, and you
don't want to write yourself into a corner on this: the library should be
compatible with ES6.


Components should fire events to a global event bus when they're
initialized/destroyed, to make auto-registration less hacky and monkeypatchy.


Get rid of the `decorate` method. The increased abstraction doesn't pay its
rent. An ordinary function could fulfill its main duty, which is customizing a
generic component before it gets added.
