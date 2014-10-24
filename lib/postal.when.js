/**
 * postal.when - A postal.js add-on enabling an aggregated response to a group of messages.
 * Author: Jim Cowart (http://freshbrewedcode.com/jimcowart)
 * Version: v0.2.0
 * Url: http://github.com/postaljs/postal.when
 * License(s): MIT
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        // Node, or CommonJS-Like environments
        module.exports = function (postal) {
            return factory(require("underscore"), postal, this);
        }
    } else if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["underscore", "postal"], function (_, postal) {
            return factory(_, postal, root);
        });
    } else {
        // Browser globals
        root.postal = factory(root._, root.postal, root);
    }
}(this, function (_, postal, global, undefined) {
    var ForkJoin = function (queue, onSuccess, onError, options) {
        var self = this,
            _onError = (Object.prototype.toString.call(onError) === "[object Function]") ? onError : function () {},
            _options = (Object.prototype.toString.call(onError) === "[object Object]") ? onError : options || {},
            _subscriptions = [],
            _timeoutFn, _startTimeOut = function () {
                if (_options.timeout) {
                    _timeoutFn = setTimeout(function () {
                        _onError({
                            type: "timeout",
                            data: _.pluck(_subscriptions, "data")
                        });
                    }, _options.timeout);
                }
            },
            _reset = function () {
                _.each(_subscriptions, function (sub) {
                    sub.data = undefined;
                });
            },
            _checkFired = function () {
                var _data = _.pluck(_subscriptions, "data"),
                    _fn;
                if (_.all(_data, _.identity)) {
                    clearTimeout(_timeoutFn);
                    onSuccess.apply(this, _data);
                    if (_options.once) {
                        self.dispose();
                    } else {
                        _reset();
                        _startTimeOut();
                    }
                }
            };
        self.dispose = function () {
            _.each(_subscriptions, function (sub) {
                sub.unsubscribe();
            });
            _subscriptions = [];
        };
        _.each(queue, function (sub) {
            // Add no-op callback for subscriptions with undefined callbacks.
            if (!sub.callback) {
                sub.callback = function () {};
            }
            var subscriptionDefinition = postal.subscribe(sub);
            subscriptionDefinition.data = undefined;
            subscriptionDefinition.subscribe(function (data) {
                subscriptionDefinition.data = data;
                _checkFired();
            });
            _subscriptions.push(subscriptionDefinition);
        });
        _startTimeOut();
    };
    postal.when = function (queue, onSuccess, onError, options) {
        return new ForkJoin(queue, onSuccess, onError, options);
    };
    return postal;
}));