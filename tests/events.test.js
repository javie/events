'use strict';

describe('Javie.Events', function () {
	var events;

	events = require(__dirname+'/../events.js').make();
	events.listener('javie.done', function () {
		return 'javie.done-emitted';
	});

	events.listener('javie.done', function () {
		return 'javie.done-again';
	});

	it('should be able to fire `javie.done`', function (done) {
		var response = events.fire('javie.done');

		if (response.length === 2) {
			done();
		}
	});

	it('should be able to run only first event `javie.done`', function (done) {
		var response = events.first('javie.done');

		if (response === 'javie.done-emitted') {
			done();
		}
	});

	it('should be able to flush `javie.done`', function (done) {
		events.flush('javie.done');
		if (events.fire('javie.done') === null) {
			done();
		}
	});

});