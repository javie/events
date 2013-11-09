instance = null
events = {}
root = exports ? this
_ = root._
_ = require('underscore') if !_ and require?

throw new Error("underscore.js is missing") if !_

class EventDispatcher
	clone: (id) ->
		clonable =
			to: (cloneTo) ->
				events[cloneTo] = _.clone(events[id])
				true
	listen: (id, cb) ->
		throw new Error("Callback is not a function") if _.isFunction(cb) is no

		response =
			id: id
			cb: cb

		events[id] ?= [];
		events[id].push(cb)

		response
	listener: (id, cb) ->
		@listen(id, cb)
	fire: (id, options) ->
		me = this
		response = []

		throw new Error("Event ID [#{id}] is not available") unless id?
		return null unless events[id]?

		runEachEvent = (cb, key) ->
			response.push(cb.apply(me, options || []))

		_.each(events[id], runEachEvent)

		response
	first: (id, options) ->
		me = this
		response = []

		throw new Error("Event ID [#{id}] is not available") unless id?
		return null unless events[id]?

		first = events[id].slice(0, 1)
		runEachEvent = (cb, key) ->
			response.push(cb.apply(me, options || []))

		_.each(first, runEachEvent)

		response[0]
	until: (id, options) ->
		me = this
		response = null

		throw new Error("Event ID [#{id}] is not available") unless id?
		return null unless events[id]?

		runEachEvent = (cb, key) ->
			response.push(cb.apply(me, options || [])) unless response?

		_.each(events[id], runEachEvent)

		response
	flush: (id) ->
		events[id] = null unless _.isUndefined(events[id])
		true
	forget: (handler) ->
		me = this
		id = handler.id
		cb = handler.cb;

		throw new Error("Event ID [#{id}] is not provided") unless _.isString(id)
		throw new Error('Callback is not a function') unless _.isFunction(cb)
		throw new Error("Event ID [#{id}] is not available") unless events[id]?

		loopEachEvent = (callback, key) ->
			if callback is cb
				events[id].splice(key, 1)

		_.each(events[id], loopEachEvent)
		true

class EventRepository
	constructor: ->
		return new EventDispatcher
	make: ->
		instance ?= new EventRepository()

if exports?
	module.exports = EventRepository if module? and module.exports
	exports.EventDispatcher = EventRepository
else
	root.Javie = {} unless root.Javie?
	root.Javie.Events = EventRepository
	root.Javie.EventDispatcher = EventRepository
