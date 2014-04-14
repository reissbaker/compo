'use strict';

function extend(Base, methods) {
  var prop,
      Derived = function() { Base.apply(this, arguments); },
      Temp = function() {};

  if(methods.hasOwnProperty('constructor')) Derived = methods.constructor;

  Temp.prototype = Base.prototype;
  Temp.prototype.constructor = Temp;

  Derived.prototype = new Temp;
  Derived.prototype.constructor = Derived;

  for(prop in methods) {
    if(methods.hasOwnProperty(prop) && prop !== 'constructor') {
      Derived.prototype[prop] = methods[prop];
    }
  }

  return Derived;
}

module.exports = extend;
