/* global describe, postal, it, after, before, expect */
(function(global) {
    var postal = typeof window === "undefined" ? require("../bower/postal.js/lib/postal.js") : window.postal;
    var expect = typeof window === "undefined" ? require("expect.js") : window.expect;
    var _ = typeof window === "undefined" ? require("underscore") : window._;
    var postalWhen = typeof window === "undefinde" ? require("../lib/postal.when.js")(postal) : window.postal;
    var subscription;
    var sub;
    var channel;
    var caughtSubscribeEvent = false;
    var caughtUnsubscribeEvent = false;

    describe( "postal.when", function () {
		describe( "when calling when with default behavior", function () {
			var data_a, data_b, data_c, data_d, callbackCount = 0, pw;

			before( function () {
				pw = postal.when( [
					{ channel : "ChannelA", topic : "topic.on.channel.a" },
					{ channel : "ChannelB", topic : "topic.on.channel.b" },
					{ channel : "ChannelC", topic : "topic.on.channel.c" },
					{ channel : "ChannelD", topic : "topic.on.channel.d" },
				], function ( a, b, c, d ) {
					data_a = a;
					data_b = b;
					data_c = c;
					data_d = d;
					callbackCount++;
				} );
				for ( var i = 0; i < 3; i++ ) {
					postal.publish( { channel : "ChannelD", topic : "topic.on.channel.d", data : "And it's testable!" } );
					postal.publish( { channel : "ChannelB", topic : "topic.on.channel.b", data : "Deferred behavior!" } );
					postal.publish( { channel : "ChannelA", topic : "topic.on.channel.a", data : "Hey look!" } );
					postal.publish( { channel : "ChannelC", topic : "topic.on.channel.c", data : "Via message bus!" } );
				}
			} );
			after( function () {
				data_a = undefined;
				data_b = undefined;
				data_c = undefined;
				data_d = undefined;
				callbackCount = 0;
				pw.dispose();
			} );
			it( "should invoke the callback the expected number of times", function () {
				expect( callbackCount ).to.be( 3 );
			} );
			it( "data_a should match expected", function () {
				expect( data_a ).to.be( "Hey look!" );
			} );
			it( "data_b should match expected", function () {
				expect( data_b ).to.be( "Deferred behavior!" );
			} );
			it( "data_c should match expected", function () {
				expect( data_c ).to.be( "Via message bus!" );
			} );
			it( "data_d should match expected", function () {
				expect( data_d ).to.be( "And it's testable!" );
			} );
		} );
		describe( "when calling when with once = true", function () {
			var data_a, data_b, data_c, data_d, callbackCount = 0, pw;

			before( function () {
				pw = postal.when( [
					{ channel : "ChannelA", topic : "topic.on.channel.a" },
					{ channel : "ChannelB", topic : "topic.on.channel.b" },
					{ channel : "ChannelC", topic : "topic.on.channel.c" },
					{ channel : "ChannelD", topic : "topic.on.channel.d" },
				], function ( a, b, c, d ) {
					data_a = a;
					data_b = b;
					data_c = c;
					data_d = d;
					callbackCount++;
				}, { once : true } );
				for ( var i = 0; i < 3; i++ ) {
					postal.publish( { channel : "ChannelD", topic : "topic.on.channel.d", data : "And it's testable!" } );
					postal.publish( { channel : "ChannelB", topic : "topic.on.channel.b", data : "Deferred behavior!" } );
					postal.publish( { channel : "ChannelA", topic : "topic.on.channel.a", data : "Hey look!" } );
					postal.publish( { channel : "ChannelC", topic : "topic.on.channel.c", data : "Via message bus!" } );
				}
			} );
			after( function () {
				data_a = undefined;
				data_b = undefined;
				data_c = undefined;
				data_d = undefined;
				callbackCount = 0;
				pw.dispose();
			} );
			it( "should only invoke the callback once", function () {
				expect( callbackCount ).to.be( 1 );
			} );
			it( "data_a should match expected", function () {
				expect( data_a ).to.be( "Hey look!" );
			} );
			it( "data_b should match expected", function () {
				expect( data_b ).to.be( "Deferred behavior!" );
			} );
			it( "data_c should match expected", function () {
				expect( data_c ).to.be( "Via message bus!" );
			} );
			it( "data_d should match expected", function () {
				expect( data_d ).to.be( "And it's testable!" );
			} );
		} );
		describe( "when calling when with a timeout that triggers onError", function () {
			var data_a, data_b, data_c, data_d, callbackCount = 0, pw, errData;

			it( "The onError callback should be invoked", function () {
				pw = postal.when( [
						{ channel : "ChannelA", topic : "topic.on.channel.a" },
						{ channel : "ChannelB", topic : "topic.on.channel.b" },
						{ channel : "ChannelC", topic : "topic.on.channel.c" },
						{ channel : "ChannelD", topic : "topic.on.channel.d" },
					], function ( a, b, c, d ) {
						data_a = a;
						data_b = b;
						data_c = c;
						data_d = d;
						callbackCount++;
						pw.dispose();
					}, function ( errData ) {
						assert( _.isEqual( errData, {
							type : "timeout",
							data : ["Hey look!", "Deferred behavior!", undefined, "And it's testable!"]
						} ) ).isTrue();
						expect( callbackCount ).to.be( 0 );
						expect( data_a == undefined ).to.be.ok();
						expect( data_b == undefined ).to.be.ok();
						expect( data_c == undefined ).to.be.ok();
						expect( data_d == undefined ).to.be.ok();
						pw.dispose();
					}, {
						timeout : 1500
					} );
				for ( var i = 0; i < 3; i++ ) {
					postal.publish( { channel : "ChannelD", topic : "topic.on.channel.d", data : "And it's testable!" } );
					postal.publish( { channel : "ChannelB", topic : "topic.on.channel.b", data : "Deferred behavior!" } );
					postal.publish( { channel : "ChannelA", topic : "topic.on.channel.a", data : "Hey look!" } );
					setTimeout( function () {
						postal.publish( { channel : "ChannelC", topic : "topic.on.channel.c", data : "Via message bus!" } );
					}, 2500 );
				}
			});
		} );
		describe( "when calling when with a timeout that does NOT trigger onError", function () {
			var pw;

			it( "data should match expected", function (done) {
				pw = postal.when( [
					{ channel : "ChannelA", topic : "topic.on.channel.a" },
					{ channel : "ChannelB", topic : "topic.on.channel.b" },
					{ channel : "ChannelC", topic : "topic.on.channel.c" },
					{ channel : "ChannelD", topic : "topic.on.channel.d" },
				], function ( a, b, c, d ) {
					expect( a ).to.be( "Hey look!" );
					expect( b ).to.be( "Deferred behavior!" );
					expect( c ).to.be( "Via message bus!" );
					expect( d ).to.be( "And it's testable!" );
					data_a = undefined;
					data_b = undefined;
					data_c = undefined;
					data_d = undefined;
					callbackCount = 0;
					pw.dispose();
					done();
				}, {
					timeout : 1500,
					onError : function () {}
				} );
				for ( var i = 0; i < 3; i++ ) {
					postal.publish( { channel : "ChannelD", topic : "topic.on.channel.d", data : "And it's testable!" } );
					postal.publish( { channel : "ChannelB", topic : "topic.on.channel.b", data : "Deferred behavior!" } );
					postal.publish( { channel : "ChannelA", topic : "topic.on.channel.a", data : "Hey look!" } );
					setTimeout( function () {
						postal.publish( { channel : "ChannelC", topic : "topic.on.channel.c", data : "Via message bus!" } );
					}, 1100 );
				}
			});
		} );
	} );

}());