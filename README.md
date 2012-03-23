# postal.when

## What is It?
postal.when is a plugin for [postal.js](https://github.com/ifandelse/postal.js) which enables "deferred" style behavior, but using a message bus (vs a typical jQuery approach).

With postal.when, you specify the channe/topics you want to wait on, and then a callback that will be invoked once *all* the messages have arrived.  The default behavior is for the "when" to be reset once it fires, allowing another round of the messages to be received again until the callback is invoked again - but it can be forced to run only once.

```javascript
// channelDefs is an array of object literals which specify channel and topic
// callback is the function to be invoked once all the messages have arrived
//    (note: callback will receive the data from each individual subscription, as args, in order
// options - currently the only option is { once : true } (this arg is optional)
postal.when(channelDefs, callback, [options]);
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