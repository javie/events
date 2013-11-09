/**
 * Client-side and Node.js Event Listener Helper
 * ==========================================================
 *
 * @package     Javie
 * @class       Event
 * @require     underscore
 * @version     1.0.0
 * @since       0.1.0
 * @author      Mior Muhammad Zaki <https://git.io/crynobone>
 * @license     MIT License
 */

(function() { 'use strict';

	var root, EventDispatcher, _, cache;

	// Save a reference to the global object (`window` in the browser, `global` on the server)
	root = this;

	// Create a safe reference to the Event Dispatcher object for use below.
	EventDispatcher = function() {
		return EventDispatcher.make();
	};

	// Export the object for **Node.js**, with
	// backwards-compatibility for the old `require()` API. If we're in
	// the browser, add `EventDispatcher` as a global object via a string
	// identifier, for Closure Compiler "advanced" mode.
	if ('undefined' !== typeof exports) {
		if ('undefined' !== typeof module && module.exports) {
			exports = module.exports = EventDispatcher;
		}

		exports.Events = exports.EventDispatcher = EventDispatcher;
	}
	else {
		// Register Javie namespace if it's not available yet.
		if ('undefined' === typeof root.Javie) {
			root.Javie = {};
		}

		root.Javie.EventDispatcher = root.Javie.Events = EventDispatcher;
	}

	// load all dependencies
	_ = root._;

	// Require underscore.js, if we're on the server, and it's not already present.
	if (!_ && ('undefined' !== typeof require)) {
		_ = require('underscore');
	}

	// throw an error if underscore.js still not available
	if (!_) {
		throw new Error('Expected Underscore.js not available');
	}

	/**
	 * Make Event instance or return one from cache.
	 *
	 * <code>
	 *     var ev = Javie.EventDispatcher.make();
	 * </code>
	 *
	 * @return {Object} Event
	 */
	EventDispatcher.make = function make() {
		var events, self;

		self = this;

		// Once EventDispatcher.make is called, we should read it from cache.
		if (!_.isNull(cache) && !_.isUndefined(cache)) {
			return cache;
		}

		events = {};

		cache  = {
			/**
			 * Add an event listener
			 *
			 * <code>
			 *     ev.listen('javie.ready', function() {
			 *         console.log('javie.ready');
			 *     });
			 * </code>
			 *
			 * @param  {String}   id
			 * @param  {Function} cb
			 * @return {Object}
			 */
			listen: function listen(id, cb) {
				if (!_.isFunction(cb)) {
					throw new Error('Callback is not a function');
				}

				if (_.isNull(events[id]) || _.isUndefined(events[id])) {
					events[id] = [];
				}

				events[id].push(cb);

				return { id : id, cb : cb };
			},

			/**
			 * Add an event listener
			 *
			 * <code>
			 *     ev.listener('javie.ready', function() {
			 *         console.log('javie.ready');
			 *     });
			 * </code>
			 *
			 * @deprecated use self::listen()
			 * @param  {String}   id
			 * @param  {Function} cb
			 * @return {Object}
			 */
			listener: function listener(id, cb) {
				return this.listen(id, cb);
			},

			/**
			 * Fire all event associated to an event id
			 *
			 * <code>
			 *     ev.fire('javie.ready');
			 * </code>
			 *
			 * @param  {String} id
			 * @param  {Array}  params
			 * @return {Array}
			 */
			fire: function fire(id, params) {
				var me, response;

				me = this;
				response = [];

				if (_.isNull(id)) {
					throw new Error('Event ID is not provided: [' + id + ']');
				}

				if (_.isNull(events[id]) || _.isNull(events[id])) {
					return null;
				}

				_.each(events[id], function runEachEvent(callback, key) {
					response.push(callback.apply(me, params || []));
				});

				return response;
			},

			/**
			 * Fire only the first event found in the collection
			 *
			 * <code>
			 *     ev.first('javie.ready');
			 * </code>
			 *
			 * @param  {String} id
			 * @param  {Array}  params
			 * @return {mixed}
			 */
			first: function first(id, params) {
				var me, response, first;

				me = this;
				response = [];

				if (_.isNull(id)) {
					throw new Error('Event ID is not provided: [' + id + ']');
				}

				if (_.isNull(events[id]) || _.isNull(events[id])) {
					return null;
				}

				first = events[id].slice(0, 1);

				_.each(first, function runEachEvent(callback, key) {
					response.push(callback.apply(me, params || []));
				});

				return response[0];
			},

			until: function until(id, params) {
				var me, response;

				me       = this;
				response = null;

				if (_.isNull(id)) {
					throw new Error('Event ID is not provided: [' + id + ']');
				}

				if (_.isNull(events[id]) || _.isNull(events[id])) {
					return null;
				}

				_.each(events[id], function runEachEvent(callback, key) {
					if (_.isNull(response)) {
						response = callback.apply(me, params || []);
					}
				});

				return null;
			},

			flush: function flush(id) {
				if (!_.isUndefined(events[id])) {
					events[id] = null;
				}
			},

			forget: function forget(handler) {
				var me, id, cb;

				me = this;
				id = handler.id;
				cb = handler.cb;

				if (!_.isString(id)) {
					throw new Error('Event ID is not provided: [' + id + ']');
				}

				if (!_.isFunction(cb)) {
					throw new Error('Callback is not a function');
				}

				if (_.isNull(events[id])) {
					throw new Error('No registered event found for [' + id + ']');
				}

				_.each(events[id], function loopEachEvent(callback, key) {
					if (callback === cb) {
						events[id].splice(key, 1);
					}
				});
			},

			/**
			 * Clone original event to a new event.
			 *
			 * @param  {String} id
			 * @return {void}
			 */
			clone: function clone(id) {
				return {
					to : function to (cloneTo) {
						events[cloneTo] = _.clone(events[id]);
					}
				};
			}
		};

		return cache;
	};

}).call(this);