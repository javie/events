/**
 * Event (Publisher/Subscriber) for Client-side JavaScript
 * ==========================================================
 * 
 * @package     Javie
 * @class       Event
 * @require     underscore
 * @since       0.1.0
 * @author      Mior Muhammad Zaki <https://git.io/crynobone>
 * @license     MIT License
 */

(function () { 'use strict'; 
	
	var root, Events, _, cache;

	// Save a reference to the global object (`window` in the browser, `global` on the server)
	root     = this;

	// Create a safe reference to the Events object for use below.
	Events  = {};

	// Export the object for **Node.js**, with
	// backwards-compatibility for the old `require()` API. If we're in
	// the browser, add `Events` as a global object via a string identifier,
	// for Closure Compiler "advanced" mode.
	if ('undefined' !== typeof exports) {
		if ('undefined' !== typeof module && module.exports) {
			exports = module.exports = Events;
		}

		exports.Events = Events;
	}
	else {
		// Register Javie namespace if it's not available yet. 
		if ('undefined' === root.Javie) {
			root.Javie = {};
		}

		root.Javie.Events = Events;
	}

	// load all dependencies
	_ = root._;

	// Require Underscore, if we're on the server, and it's not already present.
	if (!_ && ('undefined' !== typeof require)) {
		_ = require('underscore');
	}

	// throw an error if underscore still not available
	if (!_) {
		throw new Error('Expected Underscore not available');
	}

	/**
	* Allow no conflict for Events
	*
	* @return {object} Events
	*/
	Events.noConflict = function noConflict() {
		root.Events = previous;
		return this;
	};

	/**
	* Make Event instance or return one from cache.
	*
	* @return {object} Event
	*/
	Events.make = function make() {
		var events, self;

		self = this;

		if (!_.isNull(cache) && !_.isUndefined(cache)) {
			return cache;
		}

		events = {};

		cache  = {
			
			listener: function listener (id, cb) {
				if (!_.isFunction(cb)) {
					throw new Error('Callback is not a function');
				}

				if (_.isNull(events[id]) || _.isUndefined(events[id])) {
					events[id] = [];
				}

				events[id].push(cb);

				return { id : id, cb : cb };
			},

			fire: function fire (id, params) {
				var me, response;

				me       = this;
				response = [];

				if (_.isNull(id)) {
					throw new Error('Event ID is not provided: [' + id + ']');
				}

				if (_.isNull(events[id]) || _.isNull(events[id])) {
					return null;
				}

				_.each(events[id], function runEachEvent (callback, key) {
					response.push(callback.apply(me, params || []));
				});

				return response;
			},

			first: function first (id, params) {
				var me, response, first;

				me       = this;
				response = [];

				if (_.isNull(id)) {
					throw new Error('Event ID is not provided: [' + id + ']');
				}

				if (_.isNull(events[id]) || _.isNull(events[id])) {
					return null;
				}

				first = events[id].slice(0, 1);

				_.each(first, function runEachEvent (callback, key) {
					response.push(callback.apply(me, params || []));
				});

				return response[0];
			},

			flush: function flush (id) {
				if ( ! _.isUndefined(events[id])) {
					events[id] = null;
				}
			},

			forget: function forget (handler) {
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

				_.each(events[id], function loopEachEvent (callback, key) {
					if (callback === cb) {
						events[id].splice(key, 1);
					}
				});
			},

			clone: function clone (id) {
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