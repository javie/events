Javie.EventDispatcher
======

Client-side and Node.js Event Listener Helper

[![Build Status](https://secure.travis-ci.org/javie/events.png?branch=master)](http://travis-ci.org/javie/events)

## Event Dispatcher

`EventDispatcher` is a publisher/subscriber object that you can use in your app, in a way it's similar to `jQuery.bind` and `jQuery.trigger` except that the event is not attach to any DOM element.

	var ev = Javie.EventDispatcher.make();
	
	var say = ev.listen('simon.say', function (say) {
		jQuery('<p>').text(say).appendTo('body');
	});
	
	ev.fire('simon.say', ['hello world']);
	ev.fire('simon.say', ['good morning']);
	ev.fire('simon.say', ['goodbye']);
	
	// the .fire action above will create <p>hello world</p><p>good morning</p><p>goodbye</p>
	
	// to forget an event listener
	ev.forget(say);
	
	// now .fire('simon.say') wouldn't do anything
	ev.fire('simon.say', ['does not output anything']);
	

### Alternative bootstrap

There few alternative method to create an instance of `EventDispatcher`.

	var ev = new Javie.EventDispatcher;
	var ev = Javie.EventDispatcher.make();
	
	// Legacy approach
	var ev = new Javie.Events;
	var ev = Javie.Events.make();

