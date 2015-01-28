'use strict';
var util = require('./util');
var Table = require('./table');
var Entity = require('./entity');
var Database = (function () {
    function Database() {
        this._guid = 0;
        this._alive = {};
        this._children = {};
        this._parents = {};
        this._tables = [];
    }
    /*
     * Table lifecycle
     * ---------------------------------------------------------------------------
     */
    /*
     * Creates a new Table<T> in the database.
     */
    Database.prototype.table = function () {
        var table = new Table();
        this._tables.push(table);
        return table;
    };
    /*
     * Removes a table from the database.
     */
    Database.prototype.drop = function (table) {
        util.remove(this._tables, table);
        return table;
    };
    /*
     * Entity lifecycle
     * ---------------------------------------------------------------------------
     */
    /*
     * Creates an entity with an optional parent.
     *
     * If given a parent, the database will ensure that the child is destroyed
     * if the parent ever is.
     */
    Database.prototype.entity = function (parent) {
        if (parent === void 0) { parent = null; }
        var id = this._guid++, entity = new Entity(this, id);
        this._alive[id] = true;
        if (parent != null && this._alive[parent.id]) {
            var row = this._children[parent.id] = this._children[parent.id] || [];
            row.push(entity);
            this._parents[id] = parent;
        }
        return entity;
    };
    /*
     * Destroys an entity.
     *
     * If the entity has any descendants, the descendants will also be destroyed.
     */
    Database.prototype.destroy = function (entity) {
        if (!this._alive[entity.id])
            return;
        // get parent before entity is killed, since the reference will disappear
        var parent = this._parents[entity.id];
        // kill entity
        kill(entity, this._tables, this._alive, this._children, this._parents);
        // clean up parent's child
        if (parent) {
            var parentChildArray = this._children[parent.id];
            util.remove(parentChildArray, entity);
            if (parentChildArray.length === 0)
                delete this._children[parent.id];
        }
        return entity;
    };
    /*
     * Cleanup methods
     * ---------------------------------------------------------------------------
     */
    /*
     * Compacts all the tables. This should be called periodically to ensure the
     * tables don't become too sparse, which would hurt performance.
     */
    Database.prototype.compact = function () {
        util.each(this._tables, function (table) {
            table.compact();
        });
    };
    /*
     * Resets the database's state.
     */
    Database.prototype.reset = function () {
        this._alive = {};
        this._children = {};
        this._parents = {};
        util.each(this._tables, function (table) {
            table.reset();
        });
        this._tables = [];
    };
    /*
     * Accessors
     * ---------------------------------------------------------------------------
     */
    /*
     * Returns all of the children of the given entity.
     */
    Database.prototype.getChildren = function (entity) {
        return this._children[entity.id];
    };
    /*
     * Returns the parent of the given entity, if one exists.
     */
    Database.prototype.getParent = function (entity) {
        return this._parents[entity.id];
    };
    /*
     * Returns true if the given entity is live (has never been destroyed).
     *
     * Returns false otherwise.
     */
    Database.prototype.isAlive = function (entity) {
        return !!this._alive[entity.id];
    };
    return Database;
})();
function kill(entity, tables, alive, children, parents) {
    tables.forEach(function (t) {
        t.detachAllFrom(entity);
    });
    delete alive[entity.id];
    delete parents[entity.id];
    var entityChildren = children[entity.id];
    if (entityChildren) {
        entityChildren.forEach(function (c) {
            kill(c, tables, alive, children, parents);
        });
        delete children[entity.id];
    }
}
module.exports = Database;
