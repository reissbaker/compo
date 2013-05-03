!function(exports) {
  'use strict';

  var RunQueue = exports.RunQueue;

  function Component() {
    this.next = new RunQueue;
    this.end = new RunQueue;
  }

  /*
   * Note: doesn't belong here. Belongs in a utility file.
   */

  Component.extend = function(Derived) {
    var prop,
        Base = this,
        Temp = function() {};
    Temp.prototype = Base.prototype;
    Temp.prototype.constructor = Temp;

    if(!Derived) Derived = function() { Base.call(this); };

    Derived.prototype = new Temp;
    Derived.prototype.constructor = Derived;

    for(prop in Base) {
      if(Base.hasOwnProperty(prop)) Derived[prop] = Base[prop];
    }

    return Derived;
  }

  Component.prototype.init = stub();
  Component.prototype.destroy = stub();

  Component.prototype.before = stub();
  Component.prototype.update = stub();
  Component.prototype.after = stub();

  Component.prototype.preprocess = stub();
  Component.prototype.render = stub();
  Component.prototype.postprocess = stub();

  function stub() { return function(delta, x, y, z) {}; }

  /*
   * Export
   * ------
   */

  exports.Component = Component;

}(seine);
