(function(){
    'use strict';

    angular.module('primaries')
        .directive('state', ['$compile', 'StateData', function($compile, StateData){
            return {
                restrict: 'A',
                scope: {},
                require: '^^svgMap',
                link: link
            };

            function link(scope, elm, attr, mapCtrl){
                var data = _.find(StateData.states, {'abbv': elm.attr('id')});
                scope.data = data;

                elm.removeAttr("state");
                elm.attr("ng-class", "[data.party, data.winner ? data.winner : 'not-voted']");
                elm.on('click', function(){
                   mapCtrl.click(data);
                });

                $compile(elm)(scope);
            }
        }]);
})();