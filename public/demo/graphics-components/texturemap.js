!function(exports) {
  'use strict';

  // Gets textures from URLs.
  // Keeps LRU cache so that textures are rebound as infrequently as possible.
  // How to implement LRU cache:
  // * Check if raster texture maps to id in texture slot
  // * If yes, awesome
  // * If no, rebind to least most recently use texture
  // * Implement lru texture as a linked list duh
  // * Slots in tex array point to { id, iterator } tuples
  //
  // Note: use a scoring algorithm, NOT strict LRU. Every time something is
  // used, it gets its score bumped. The list is the top 32 scoring textures: to
  // get into the list, you need to beat the score of the lowest one. Add some
  // sort of decay to the algorithm so that previously-hot but now cold textures
  // get ejected relatively quickly.
  function TextureMap() {
  }

  TextureMap.prototype.fromUrl = function() {};

  function normalizeUrl(url) {
  }

  exports.TextureMap = TextureMap;

}(demo);
