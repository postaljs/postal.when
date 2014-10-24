var ForkJoin = function ( queue, onSuccess, onError, options ) {
	var self = this,
		_onError = (Object.prototype.toString.call( onError ) === "[object Function]") ? onError : function () {
		},
		_options = (Object.prototype.toString.call( onError ) === "[object Object]") ? onError : options || {},
		_subscriptions = [],
		_timeoutFn,
		_startTimeOut = function () {
			if ( _options.timeout ) {
				_timeoutFn = setTimeout( function () {
					_onError( { type : "timeout", data : _.pluck( _subscriptions, "data" )} );
				}, _options.timeout );
			}
		},
		_reset = function () {
			_.each( _subscriptions, function ( sub ) {
				sub.data = undefined;
			} );
		},
		_checkFired = function () {
			var _data = _.pluck( _subscriptions, "data" ),
				_fn;
			if ( _.all( _data, _.identity ) ) {
				clearTimeout( _timeoutFn );
				onSuccess.apply( this, _data );
				if ( _options.once ) {
					self.dispose();
				} else {
					_reset();
					_startTimeOut();
				}

			}
		};

	self.dispose = function () {
		_.each( _subscriptions, function ( sub ) {
			sub.unsubscribe();
		} );
		_subscriptions = [];
	};

	_.each( queue, function ( sub ) {
		// Add no-op callback for subscriptions with undefined callbacks.
		if (!sub.callback) {
			sub.callback = function () {};
		}
		var subscriptionDefinition = postal.subscribe( sub );
		subscriptionDefinition.data = undefined;
		subscriptionDefinition.subscribe( function ( data ) {
			subscriptionDefinition.data = data;
			_checkFired();
		} );
		_subscriptions.push( subscriptionDefinition );
	} );

	_startTimeOut();
};

postal.when = function ( queue, onSuccess, onError, options ) {
	return new ForkJoin( queue, onSuccess, onError, options );
};