Javie.Events
======

Client-side and Node.js Event Listener Helper

[![Build Status](https://secure.travis-ci.org/javie/events.png?branch=master)](http://travis-ci.org/javie/events)

## Events

`Events` is a publisher/subscriber object that you can use in your app, in a way it's similar to `jQuery.bind` and `jQuery.trigger` except that the event is not attach to any DOM element.

	var ev = Javie.Events.make();
	
	var say = ev.listen('say', function (say) {
		jQuery('<p>').text(say).appendTo('body');
	});
	
	ev.fire('say', ['hello world']);
	ev.fire('say', ['good morning']);
	ev.fire('say', ['goodbye']);
	
	// the .fire action above will create <p>hello world</p><p>good morning</p><p>goodbye</p>
	
	// to forget an event listener
	ev.forget(say);
	
	// now .fire('say') wouldn't do anything
	ev.fire('say', ['does not output anything']);