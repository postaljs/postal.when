/*jshint -W098 */
(function ( root, factory ) {
	if ( typeof module === "object" && module.exports ) {
		// Node, or CommonJS-Like environments
		module.exports = function( postal ) {
			return factory( require( "lodash" ), postal , this );
		}
	} else if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define( ["lodash", "postal"], function ( _, postal ) {
			return factory( _, postal, root );
		} );
	} else {
		// Browser globals
		root.postal = factory( root._, root.postal, root );
	}
}( this, function ( _, postal, global, undefined ) {

	//import("when.js");

	return postal;
}));
