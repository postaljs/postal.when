# postal.when

## What is It?
postal.when is a plugin for [postal.js](https://github.com/ifandelse/postal.js) which enables "deferred" style behavior, but using a message bus (vs a typical jQuery approach).

With postal.when, you specify the channe/topics you want to wait on, and then a callback that will be invoked once *all* the messages have arrived.  The default behavior is for the "when" to be reset once it fires, allowing another round of the messages to be received until the callback is invoked again - but it can be forced to run only once.

```javascript
/* channelDefs - is an array of object literals which specify channel and topic
   onSuccess   - invoked once all the messages have successfully arrived
				 (note: onSuccess will receive the data from each individual subscription, as args, in order)
   onError     - [optional] - invoked if the operation fails (currently only a timeout fails the operation)
   options     - [optional] - can provide the following:
				 {
					once: true,     // if true, the 'fork/join" process is only run once
									// and not reset afterwards to run again
					timeout: 2000,  // a timeout value in milliseconds.  It fires the onError
									// callback if the timeout occurs before all messages have arrived
				 }
*/
postal.when(channelDefs, onSuccess, onError, options);
postal.when(channelDefs, onSuccess, options);
postal.when(channelDefs, onSuccess, onError);
postal.when(channelDefs, onSuccess);
```

Here's a quick usage example:

```javascript
postal.when([
    { channel: "ChannelA", topic: "topic.on.channel.a" },
    { channel: "ChannelB", topic: "topic.on.channel.b" },
    { channel: "ChannelC", topic: "topic.on.channel.c" },
    { channel: "ChannelD", topic: "topic.on.channel.d" },
], function(a, b, c, d){
    _.each(arguments, function(x) {
        $('body').append("<div>" + x + "</div>");
    });
});

postal.publish( { channel: "ChannelD", topic: "topic.on.channel.d", data: "And it's testable!" } );
postal.publish( { channel: "ChannelB", topic: "topic.on.channel.b", data: "Deferred behavior!" } );
postal.publish( { channel: "ChannelA", topic: "topic.on.channel.a", data: "Hey look!" } );
postal.publish( { channel: "ChannelC", topic: "topic.on.channel.c", data: "Via message bus!" } );
```

## How to Include It
postal.when will work in both standard and AMD/require.js environments as well as node.js.  Simply include it in your project (after underscore and postal, if you're not using AMD), and it will automatically add the "when" method to postal's global object.

For node.js, postal.when returns a factory function which you should invoke and pass in the reference to postal:

```javascript
// this is assuming underscore and postal have been required above somewhere...
var postal = require("postal");
var postalWhen = require("path/to/postal/when")(postal);
```