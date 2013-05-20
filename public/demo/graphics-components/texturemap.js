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
  function TextureMap() {
  }

  TextureMap.prototype.fromUrl = function() {};

  function normalizeUrl(url) {
  }

  exports.TextureMap = TextureMap;

}(demo);
