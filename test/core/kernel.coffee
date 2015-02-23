{expect} = require 'chai'
Kernel = require '../../build/lib/core/kernel'
System = require '../../build/lib/core/system'

describe 'kernel', ->
  kernel = null
  beforeEach ->
    kernel = new Kernel

  describe '#nextTick', ->
    it 'calls the callback on the next tick', (done) ->
      kernel.nextTick -> done()
      kernel.tick()
    it 'calls the callbacks in the order they were enqueued', (done) ->
      count = 0

      kernel.nextTick ->
        count++
        expect(count).to.equal(1)
      kernel.nextTick ->
        count++
        expect(count).to.equal(2)
      kernel.nextTick ->
        done()

      kernel.tick()

  describe '#reset', ->
    it 'prevents future callbacks from running', (done) ->
      kernel.nextTick ->
        kernel.reset()
        done()
      kernel.nextTick ->
        done()

      kernel.tick(16)

    it 'removes all systems', ->
      class StatefulSystem extends System
        constructor: ->
          super()
          @attached = false
        onAttach: ->
          @attached = true
        onDetach: ->
          @attached = false

      system = new StatefulSystem
      expect(system.attached).to.be.false
      kernel.attach(system)
      expect(system.attached).to.be.true
      kernel.reset()
      expect(system.attached).to.be.false
