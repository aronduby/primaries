(function() {
    'use strict';

    angular.module('primaries')
        .directive('svgMap', ['$compile', 'StyleVariables', function($compile, style) {
            return {
                restrict: 'E',
                scope: {},
                bindToController: {},
                templateUrl: 'images/states.svg',
                controller: ctrl,
                controllerAs: 'svgMapCtrl',
                link: link
            };

            function link(scope, elm, attr) {
                var states   = elm[0].querySelectorAll('#StatePolys path');
                var patterns = elm[0].querySelectorAll('Pattern');

                // make sure the colors in the patterns match up
                angular.forEach(patterns, function(pattern) {
                    var type, rect;

                    pattern = angular.element(pattern);
                    rect = pattern.find('rect');
                    type = pattern.attr('id').split('-')[1];

                    rect.attr('fill', style.vars[type]);
                });

                // setup our states
                angular.forEach(states, function(path) {
                    var abbv     = path.id;
                    var stateElm = angular.element(path);
                    stateElm.attr('state', '');
                    $compile(stateElm)(scope);
                });
            }

            function ctrl() {
                this.click = function(data) {
                    console.log(data);
                };
            }

        }]);
})();