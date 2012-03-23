	var forkJoin = function(queue, callback, options) {
		var self = this,
			_subscriptions = [],
			_reset = function() { _.each(_subscriptions, function(sub) { sub.data = undefined; }); },
			_options = options || {},
			_checkFired = function() {
				var _data = _.pluck(_subscriptions, "data"),
					_fn;
				if(_.all(_data, _.identity)) {
					callback.apply(this, _data);
					if(_options.once)
						self.dispose();
					else
						_reset();

				}
			};

		self.dispose = function() {
			_.each(_subscriptions, function(sub) {
				sub.unsubscribe();
			});
			_subscriptions = [];
		};

		_.each(queue, function(sub) {
			var subscriptionDefinition = postal.subscribe(sub);
			subscriptionDefinition.data = undefined;
			subscriptionDefinition.subscribe(function(data) {
				subscriptionDefinition.data = data;
				_checkFired();
			});
			_subscriptions.push(subscriptionDefinition);
		});
	};

	postal.when = function(queue, callback) {
		return new forkJoin(queue, callback);
	};