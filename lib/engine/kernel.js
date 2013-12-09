!function(exports) {
  var Component = exports.Component;

  var Kernel = Component.extend(function(node, overlay) {
    Component.call(this);

    this.push(overlay);
    this.root = this.push(node);
  });

  Kernel.prototype.switchRoot = function(newRoot) {
    var that = this;
    this.next.enqueue(function() {
      if(that.root) {
        that.remove(that.root);
        that.root = newRoot;
        that.push(newRoot);
      }
    });
  };

  exports.Kernel = Kernel;
}(seine);
