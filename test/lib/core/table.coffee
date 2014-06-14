{expect} = require 'chai'
Table = require '../../../build/lib/core/table'
Component = require '../../../build/lib/core/component'
Database = require '../../../build/lib/core/database'

describe 'table', ->
  db = null
  table = null

  beforeEach ->
    db = new Database
    table = db.table()

  describe 'attach', ->
    it 'attaches a component to an entity', ->
      entity = db.entity()
      component = new Component
      table.attach(entity, component)

      expect(table.getComponents(entity)).to.deep.equal([component])

    it 'sets the component\'s entity', ->
      entity = db.entity()
      component = new Component()
      table.attach(entity, component)

      expect(component.entity).to.equal(entity)

    it 'fires the attach event', (done) ->
      entity = db.entity()
      table.on 'attach', -> done()
      table.attach(entity, new Component)

    it 'passes the attached component to the attach event handler', (done) ->
      entity = db.entity()
      component = new Component
      table.on 'attach', (attached) ->
        expect(attached).to.equal(component)
        done()
      table.attach(entity, component)


  describe 'detach', ->
    it 'detaches a component from an entity if it is attached', ->
      entity = db.entity()
      component = new Component
      other = new Component
      table.attach(entity, component)
      table.attach(entity, other)
      table.detach(entity, component)

      expect(table.getComponents(entity)).to.deep.equal([other])

    it 'deletes cleans up internal state if all components are detached', ->
      entity = db.entity()
      component = new Component
      table.attach(entity, component)
      table.detach(entity, component)

      expect(table.getComponents(entity)).to.equal(undefined)

    it 'does nothing if the component isn\'t attached to the entity', ->
      a = db.entity()
      b = db.entity()
      component = new Component
      table.attach(a, component)
      table.detach(b, component)

      expect(table.getComponents(a)).to.deep.equal([component])
      expect(component.entity).to.equal(a)

    it 'does nothing if the component is completely unattached', ->
      entity = db.entity()
      component = new Component
      table.detach(entity, component)

    it 'fires the detach event', (done) ->
      entity = db.entity()
      component = new Component
      table.on 'detach', -> done()
      table.attach(entity, component)
      table.detach(entity, component)

    it 'passes the detached component to the detach event handler', (done) ->
      entity = db.entity()
      component = new Component
      table.attach(entity, component)
      table.on 'detach', (detached) ->
        expect(detached).to.equal(component)
        done()
      table.detach(entity, component)


  describe 'detachAllFrom', ->
    it 'detaches all components from a given entity', ->
      entity = db.entity()
      table.attach(entity, new Component)
      table.attach(entity, new Component)
      table.attach(entity, new Component)
      table.detachAllFrom(entity)

      expect(table.getComponents(entity)).to.equal(undefined)

    it 'does nothing if the entity has no components', ->
      entity = db.entity()
      table.detachAllFrom(entity)

    it 'fires detach events for all detached components', (done) ->
      entity = db.entity()
      a = table.attach(entity, new Component)
      b = table.attach(entity, new Component)
      c = table.attach(entity, new Component)
      all = [a, b, c]
      times = all.length
      table.on 'detach', (component) ->
        expect(all).to.include.members([component])
        times--
        done() if times == 0
      table.detachAllFrom(entity)

