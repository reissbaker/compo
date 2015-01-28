'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var System = require('../core/system');
var BehaviorSystem = (function (_super) {
    __extends(BehaviorSystem, _super);
    function BehaviorSystem() {
        _super.apply(this, arguments);
    }
    BehaviorSystem.prototype.onAttach = function (db) {
        this.table = db.table();
    };
    BehaviorSystem.prototype.onDetach = function (db) {
        db.drop(this.table);
    };
    BehaviorSystem.prototype.update = function (delta) {
        this.table.attached(function (behavior) {
            behavior.update(delta);
        });
    };
    return BehaviorSystem;
})(System);
module.exports = BehaviorSystem;
