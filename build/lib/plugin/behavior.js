'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Component = require('../core/component');
var Behavior = (function (_super) {
    __extends(Behavior, _super);
    function Behavior() {
        _super.apply(this, arguments);
    }
    Behavior.prototype.update = function (delta) {
    };
    return Behavior;
})(Component);
module.exports = Behavior;
