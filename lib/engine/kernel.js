!function(exports) {
  var Component = exports.Component;

  var Kernel = Component.extend({
    constructor: function(node, overlay) {
      Component.call(this);

      this.push(overlay);
      this.scene = this.push(node);
    },

    switchScene: function(newScene) {
      var that = this;
      this.next.enqueue(function() {
        if(that.scene) {
          that.remove(that.scene);
          that.scene = newScene;
          that.push(newScene);
        }
      });
    }
  });

  exports.Kernel = Kernel;
}(seine);
