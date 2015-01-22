'use strict';

var wate = require('wate');

module.exports = function(map, callback) {
  var key,
      futures = [],
      valueMap = {images: {}};

  for(key in map.images) {
    if(map.images.hasOwnProperty(key)) {
      futures.push(loadImage(map.images[key], valueMap.images, key));
    }
  }

  // Return both a Wate Future and expose a callback-based API.
  return wate.bind(wate.all(futures), function() {
    return valueMap;
  }).done(callback);
};

function loadImage(url, collector, key) {
  return wate.make(function(callback) {
    var image = new Image();
    image.src = url;
    image.onload = function() {
      collector[key] = image;
      callback(null, image);
    };
    image.onerror = function() {
      callback(new Error('failed to load ' + url));
    };
  });
}
