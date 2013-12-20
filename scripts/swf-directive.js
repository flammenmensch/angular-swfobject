/**
 * Created with IntelliJ IDEA.
 * User: Flammenmensch
 * Date: 20.12.13
 * Time: 12:44
 * To change this template use File | Settings | File Templates.
 */
(function (angular, swfobject) {
    angular.module('angular-swfobject', [ ])
        .directive('swfObject', function () {
            return {
                restrict: 'AE',
                template: '<div></div>',
                scope: {
                    source:         '@',
                    width:          '@',
                    height:         '@',
                    version:        '@',
                    expressInstall: '@',
                    params:         '@',
                    flashvars:      '@',
                    attributes:     '@',
                    callback:       '&'
                },
                link: function (scope, iElement, iAttrs) {
                    var params = {
                        menu: false,
                        quality: 'high',
                        wmode: 'window',
                        bgcolor: '#ffffff',
                        allowscriptaccess: 'never',
                        allowfullscreen: false
                    };

                    var flashvars = { };

                    var attributes = {
                        align: 'left',
                        id: iElement[0].id
                    };

                    var embedSwf = function () {
                        swfobject.embedSWF(
                            scope.source,
                            iElement[0].id,
                            scope.width || '100%',
                            scope.height || '100%',
                            scope.version || '11.9.0',
                            scope.expressInstall || null,
                            angular.extend(flashvars, scope.flashvars),
                            angular.extend(params, scope.params),
                            angular.extend(attributes, scope.attributes),
                            function (event) {
                                if (scope.callback && (typeof scope.callback === 'function')) {
                                    scope.callback({ event: event });
                                }
                            }
                        );
                    };

                    scope.$watch('source', function (newValue, oldValue, scope) {
                        embedSwf();
                    });
                }
            };
        });
} (window.angular, window.swfobject));