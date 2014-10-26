{expect} = require 'chai'
Table = require '../../../build/lib/core/table'
Component = require '../../../build/lib/core/component'
Database = require '../../../build/lib/core/database'
Entity = require '../../../build/lib/core/entity'

describe 'database', ->
  db = null
  beforeEach ->
    db = new Database

  describe 'table', ->
    it 'returns a new table', ->
      table = db.table()
      expect(table).to.be.instanceof(Table)

  describe 'drop', ->
    it 'drops the table if it was added', ->
      table = db.table()
      db.drop(table)
      expect(db._tables).to.deep.equal([])

    it 'does nothing if the table was never added', ->
      db2 = new Database
      table = db.table()
      db2.drop(table)

  describe 'entity', ->
    it 'returns an Entity', ->
      entity = db.entity()
      expect(entity).to.be.an.instanceof(Entity)

    it 'returns an entity with a unique id', ->
      a = db.entity()
      b = db.entity()
      expect(a.id).to.not.equal(b.id)

    it 'keeps track of children', ->
      a = db.entity()
      b = db.entity(a)
      expect(db.getChildren(a)).to.deep.equal([b])

    it 'keeps track of parents', ->
      a = db.entity()
      b = db.entity(a)
      expect(db.getParent(b)).to.equal(a)


  describe 'destroy', ->
    it 'destroys the entity', ->
      a = db.entity()
      db.destroy(a)
      expect(db.isAlive(a)).to.be.false

    it 'destroys child entities when the parent is destroyed', ->
      a = db.entity()
      b = db.entity(a)
      db.destroy(a)
      expect(db.isAlive(a)).to.not.be.true
      expect(db.isAlive(b)).to.not.be.true
      expect(db.getChildren(a)).to.equal(undefined)

    it 'detaches all attached components from tables', (done) ->
      entity = db.entity()
      table = db.table()
      component = table.attach(entity, new Component)
      table.on 'detach', (detached) ->
        expect(detached).to.equal(component)
        done()
      db.destroy(entity)

  describe 'reset', ->
    it 'resets internal state', ->
      a = db.entity()
      b = db.entity(a)
      db.reset()
      expect(db.isAlive(a)).to.not.be.true
      expect(db.isAlive(b)).to.not.be.true
      expect(db.getChildren(a)).to.equal(undefined)
      expect(db.getParent(b)).to.equal(undefined)

    it 'resets tables', ->
      a = db.entity()
      table = db.table()
      component = table.attach(a, new Component)
      db.reset()
      expect(table.getAttached()).to.deep.equal([])

