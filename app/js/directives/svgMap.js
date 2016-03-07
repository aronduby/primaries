(function() {
    'use strict';

    angular.module('primaries')
        .directive('svgMap', ['$compile', 'StateData', function($compile, StateData) {
            return {
                restrict: 'EA',
                scope: {},
                templateUrl: 'images/states.svg',
                controller: ['$scope', ctrl],
                link: link
            };

            function link(scope, elm, attr) {
                var states = elm[0].querySelectorAll('#StatePolys path');

                angular.forEach(states, function(path) {
                    var abbv = path.id;
                    var stateElm = angular.element(path);
                    stateElm.attr('state', '');
                    $compile(stateElm)(scope);
                });
            }

            function ctrl(scope) {
                this.click = function(data) {
                    console.log(data);
                }
            }

        }]);
})();