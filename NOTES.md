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


Currently the game objects are awkwardly object-oriented, rather than being
driven by entities and the database. If you put more of the data into tables,
you wouldn't need any of the gross OO/ECS hybrid: you could use pure ECS and
drive everything from the tables. For example, put the location points into the
database, so you don't need hard references to them to find them later. Then
you can just pass around entities, rather than these wrapper objects.

