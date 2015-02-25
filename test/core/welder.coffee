{expect} = require 'chai'
Database = require '../../build/lib/core/database'
Table = require '../../build/lib/core/table'
Component = require '../../build/lib/core/component'
Entity = require '../../build/lib/core/entity'
{ StandardWelder } = require '../../build/lib/core/welder'

describe 'StandardWelder', ->
  db = null
  table = null
  entity = null

  beforeEach ->
    db = new Database
    table = db.table()
    entity = db.entity()

  describe '#attach', ->
    it 'calls the builder callback', (done) ->
      welder = new StandardWelder table, ->
        done()
        new Component

      welder.attach(entity, {})

    it 'passes the args from attach() to the builder', ->
      args = { hello: 'world' }
      welder = new StandardWelder table, (expectedArgs) ->
        expect(expectedArgs).to.equal(args)
      welder.attach(entity, args)

    it 'attaches the built object to the entity on the table', ->
      component = new Component
      welder = new StandardWelder table, -> component
      welder.attach(entity, component)
      expect(table.getComponents(entity)).to.deep.equal([ component ])

    it 'returns the built object', ->
      component = new Component
      welder = new StandardWelder table, -> component
      returned = welder.attach(entity, component)
      expect(component).to.equal(returned)

  describe '#detach', ->
    it 'detaches the component from the entity on the table', ->
      welder = new StandardWelder table, -> new Component

      component = welder.attach(entity)
      welder.detach(entity, component)
      table.compact() # clean up nulls

      expect(table.getComponents(entity)).to.be.empty
