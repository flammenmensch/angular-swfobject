/**
 * Created with IntelliJ IDEA.
 * User: Flammenmensch
 * Date: 24.12.13
 * Time: 20:24
 * To change this template use File | Settings | File Templates.
 */
(function (angular, swfobject) {
    'use strict';

    angular.module('angular-swfobject', [ ])
        .provider('swfService', function () {
            var configObject = {
                url: '',
                width: '100%',
                height: '100%',
                elementId: '',
                version: '11.9.0',
                expressInstall: '',
                params: { },
                flashvars: { },
                attributes: { }
            };

            var setOption = function (name, value) {
                if (value === undefined) {
                    return configObject[name];
                }

                configObject[name] = value;

                return this;
            };

            /**
             * DOM element id
             * @param {string} value
             * @returns {*}
             */
            this.elementId = function (value) {
                return setOption.call(this, 'elementId', value);
            };
            /**
             * Container width
             * @param {string} value
             * @returns {*}
             */
            this.width = function (value) {
                return setOption.call(this, 'width', value);
            };
            /**
             * Container height
             * @param {string} value
             * @returns {*}
             */
            this.height = function (value) {
                return setOption.call(this, 'height', value);
            };
            /**
             * ExpressInstall.swf url
             * @param {string} value
             * @returns {*}
             */
            this.expressInstall = function (value) {
                return setOption.call(this, 'expressInstall', value);
            };
            /**
             * Minimal flash player version
             * @param {string} value
             * @returns {*}
             */
            this.version = function (value) {
                return setOption.call(this, 'version', value);
            };
            /**
             * SWF url
             * @param {string} value
             * @returns {*}
             */
            this.url = function (value) {
                return setOption.call(this, 'url', value);
            };
            /**
             * Additional attributes
             * @param {object} value
             * @returns {*}
             */
            this.attributes = function (value) {
                return setOption.call(this, 'attributes', value);
            };
            /**
             * Embed parameters
             * @param {object} value
             * @param value.wmode
             * @param value.bgcolor
             * @param value.allowfullscreen
             * @param value.allowscriptaccess
             * @returns {*}
             */
            this.params = function (value) {
                return setOption.call(this, 'params', value);
            };
            /**
             * Flashvars
             * @param {object} value
             * @returns {*}
             */
            this.flashvars = function (value) {
                return setOption.call(this, 'flashvars', value);
            };

            this.$get = [ '$q', function ($q) {
                var elementRef = null;

                var Service = function() { };
                /**
                 * Getter for config object
                 * @returns {{swfUrl: string, width: string, height: string, elementId: string, version: string, expressInstall: string, params: object, flashvars: object, attributes: object}}
                 */
                Service.prototype.config = function () {
                    return configObject;
                };
                /**
                 * Getter for created <object /> element
                 * @returns {null}
                 */
                Service.prototype.element = function () {
                    return elementRef;
                };
                /**
                 * Embed swf
                 * @returns {promise}
                 */
                Service.prototype.embedSwf = function () {
                    var deferred = $q.defer();
                    var c = configObject;
                    swfobject.embedSWF(
                        c.url,
                        c.elementId,
                        c.width,
                        c.height,
                        c.version,
                        c.expressInstall,
                        c.flashvars,
                        c.params,
                        c.attributes,
                        function (event) {
                            if (!event.success) {
                                return deferred.reject(event);
                            }

                            elementRef = event.ref;

                            deferred.resolve(event);
                        }
                    );

                    return deferred.promise;
                };

                return new Service();
            } ];
        });
} (window.angular, window.swfobject));