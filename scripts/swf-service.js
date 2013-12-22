/**
 * Created with IntelliJ IDEA.
 * User: Flammenmensch
 * Date: 24.12.13
 * Time: 20:24
 * To change this template use File | Settings | File Templates.
 */
(function (angular, swfobject) {
    'use strict';

    angular.module('angular-swfobject', [])
        .provider('swfService', function () {


            var simpleObserver = function(obj){

                var events = {};
                obj.on = function(evt,cb){


                    var callbacks = events[evt];
                    if (!callbacks){
                        callbacks = events[evt] = [];
                    }

                    if (callbacks.indexOf(cb)<0){
                        callbacks.push(cb);
                    }

                    return obj;
                };

                obj.off = function(evt,cb){
                    if (evt && events[evt]){


                        if (cb){
                            var ind = events[evt].indexOf(cb);
                            if (ind >= 0){
                                events[evt].splice(ind,1);
                            }
                        } else {
                            events[evt] = [];
                        }
                    }
                };

                obj.fireEvt = function(evt, data){
                    var callbacks = events[evt];
                    if (!!callbacks){
                        callbacks.forEach(function (cb) {
                            cb(evt, data);
                        })
                    }
                };

                return obj;
            };

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

            this.$get = [ '$q', function ($q){

                var Service = function() { };
                /**
                 * Getter for config object
                 * @returns {{swfUrl: string, width: string, height: string, elementId: string, version: string, expressInstall: string, params: object, flashvars: object, attributes: object}}
                 */
                Service.prototype.config = function () {
                    return configObject;
                };
                /**
                 * Embed swf
                 * @returns {promise}
                 */
                Service.prototype.embedSwf = function (Config){

                    // готовим глобалскоп
                    if (!window.swfService){ window.swfService = {}; }
                    if (!window.swfService.bridges){ window.swfService.bridges = {}; }

                    var deferred = $q.defer();
                    var c = angular.copy(configObject);

                    angular.extend(c,Config);

                    var uuid = 'bridge' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + (new Date().getTime());

                    var obj = simpleObserver({
                        callFn:function(fnName,args){
                            if(this.ref){
                                this.ref['bridge_in'](fnName,args);
                            }
                        },
                        release:function(){
                            delete window.swfService.bridges[uuid];
                            // и както удалить объект с id-ником
                        }
                    });

                    var bridge = function(evt,data){
                        obj.fireEvt(evt,data);
                    };

                    window.swfService.bridges[uuid] = bridge;

                    c.flashvars.bridge_in  = 'bridge_in'; // функция для ввода в флеш
                    c.flashvars.bridge_out = 'window.swfService.bridges.'+uuid; // функция для вывода в js

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
                                deferred.reject(event);
                            } else {
                                obj.ref = event.ref;
                                obj.id = event.id;

                                deferred.resolve(obj);
                            }
                        }
                    );

                    return deferred.promise;
                };

                return new Service();
            } ];
        });
})(window.angular, window.swfobject);