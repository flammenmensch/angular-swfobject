/**
 * Created with IntelliJ IDEA.
 * User: Flammenmensch
 * Date: 25.12.13
 * Time: 16:11
 * To change this template use File | Settings | File Templates.
 */
(function (angular) {
    angular.module('megavisor-swfservice', [ 'angular-swfobject' ])
        .config([ '$provide', function ($provide) {
            var guid = function guid() {
                var s4 = function () {
                    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                };
                return (s4() + s4() + '-' + s4() + '-4' + s4().substr(0,3) + '-' + s4() + '-' + s4() + s4() + s4()).toLowerCase();
            };

            var bridgeId = guid();
            var bridgeNamespace = "com.megavisor.Linker";
            var callbackFunctionName = 'callbackFn';
            var callbackFunctionImpl = function callbackFunctionImpl (type, data) {
                console.log(arguments);
            };

            $provide.decorator('$window', function ($delegate) {
                if (!$delegate.hasOwnProperty(bridgeNamespace)) {
                    $delegate[bridgeNamespace] = { };
                }

                if (!$delegate[bridgeNamespace].hasOwnProperty(bridgeId)) {
                    $delegate[bridgeNamespace][bridgeId] = { };
                }

                $delegate[bridgeNamespace][bridgeId][callbackFunctionName] = callbackFunctionImpl;

                return $delegate;
            });

            $provide.decorator('swfService', function ($delegate) {
                var config = $delegate.config();

                angular.extend(config.flashvars, {
                    bridgeId: bridgeId,
                    bridgeNamespace: bridgeNamespace,
                    callbackFunctionName: callbackFunctionName
                });

                var MegavisorServiceWrapper = function () { };

                MegavisorServiceWrapper.prototype = $delegate;

                MegavisorServiceWrapper.prototype.callback = function () {
                    return callbackFunctionImpl;
                };

                MegavisorServiceWrapper.prototype.api = function (method, data) {
                    var element = $delegate.element.call(this);

                    if (element === undefined) {
                        throw new Error('Element is undefined');
                    }

                    return element.api(method, data);
                };

                MegavisorServiceWrapper.prototype.config = function () {
                    return config;
                };

                MegavisorServiceWrapper.prototype.hotspot = function hotspot(value) {
                    if (value === undefined) {
                        return this.api('getCurrentHotspotData');
                    }

                    this.api('setCurrentHotspotData', value);

                    return this;
                };

                return new MegavisorServiceWrapper();
            });
        } ]);
} (window.angular));