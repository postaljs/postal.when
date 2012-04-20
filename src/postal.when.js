//import("VersionHeader.js");
(function ( root, doc, factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["underscore", "postal"], function ( _, postal ) {
			return factory( _, postal, root, doc );
		} );
	} else {
		factory( root._, root.postal, root, doc );
	}
}( this, document, function ( _, postal, global, document, undefined ) {
	//import("when.js");
} ));