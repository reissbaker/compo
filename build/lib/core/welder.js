'use strict';
var StandardWelder = (function () {
    function StandardWelder(table, builder) {
        this._table = table;
        this._builder = builder;
    }
    StandardWelder.prototype.attach = function (e, args) {
        var component = this._builder(args);
        return this._table.attach(e, component);
    };
    StandardWelder.prototype.detach = function (e, c) {
        return this._table.detach(e, c);
    };
    return StandardWelder;
})();
exports.StandardWelder = StandardWelder;
