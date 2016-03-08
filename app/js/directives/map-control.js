(function() {
    'use strict';

    angular.module('primaries')
        .directive('mapControl', ['$compile', 'StyleVariables', function($compile, style) {
            return {
                restrict: 'E',
                templateUrl: 'partials/map-control.html',
                transclude: true,
                scope: {},
                bindToController: {},
                controller: ctrl,
                controllerAs: 'mcvm',
                link: link
            };

            function link(scope, elm, attr) {

            }

            function ctrl(){
                this.states = 'states--all';
                this.candidates = 'candidates--all';


            }

        }]);
})();
