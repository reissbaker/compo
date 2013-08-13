!function(exports) {
  var Component = exports.Component;

  var Kernel = Component.extend(function(node) {
    Component.call(this);

    this.root = this.push(node);
  });

  Kernel.prototype.switchRoot = function(newRoot) {
    var ref = this;
    this.next.enqueue(function() {
      if(ref.root) {
        ref.remove(ref.root);
        ref.root._destroy();
        ref.root = newRoot;
        newRoot._init();
      }
    });
  };

  exports.Kernel = Kernel;
}(seine);
