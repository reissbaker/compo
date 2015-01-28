var Entity = (function () {
    function Entity(db, id) {
        this._db = db;
        this.id = id;
    }
    Entity.prototype.entity = function () {
        return this._db.entity(this);
    };
    Entity.prototype.destroy = function () {
        return this._db.destroy(this);
    };
    Entity.prototype.getParent = function () {
        return this._db.getParent(this);
    };
    Entity.prototype.getChildren = function () {
        return this._db.getChildren(this);
    };
    Entity.prototype.isAlive = function () {
        return this._db.isAlive(this);
    };
    return Entity;
})();
module.exports = Entity;
