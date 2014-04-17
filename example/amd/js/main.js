require.config( {
	paths : {
		underscore    : '../../../bower/underscore/underscore',
		postal        : '../../../bower/postal.js/lib/postal',
		postaldiags   : '../../../bower/postal.diagnostics/lib/postal.diagnostics',
		jquery        : '../../../bower/jquery/jquery',
		'postal.when' : '../../../lib/postal.when'
	},
	shim: {
		underscore : {
			exports: "_"
		}
	}
});

require( ['jquery', 'underscore', 'postal', 'postal.when'], function ( $, _, postal ) {
	$( function () {
		postal.when( [
			{ channel : "ChannelA", topic : "topic.on.channel.a" },
			{ channel : "ChannelB", topic : "topic.on.channel.b" },
			{ channel : "ChannelC", topic : "topic.on.channel.c" },
			{ channel : "ChannelD", topic : "topic.on.channel.d" },
		], function ( a, b, c, d ) {
			_.each( arguments, function ( x ) {
				$( 'body' ).append( "<div>" + x + "</div>" );
			} );
		} );

		postal.publish( { channel : "ChannelD", topic : "topic.on.channel.d", data : "And it's testable!" } );
		postal.publish( { channel : "ChannelB", topic : "topic.on.channel.b", data : "Deferred behavior!" } );
		postal.publish( { channel : "ChannelA", topic : "topic.on.channel.a", data : "Hey look!" } );
		postal.publish( { channel : "ChannelC", topic : "topic.on.channel.c", data : "Via message bus!" } );
	} );
} );


