(function() {
    'use strict';

    angular.module('primaries')
        .directive('state', ['$compile', 'StateData', function($compile, StateData) {
            return {
                restrict: 'A',
                scope: {},
                require: '^^svgMap',
                link: link
            };

            function link(scope, elm, attr, mapCtrl) {
                var data = _.find(StateData.states, {'abbv': elm.attr('id')});
                scope.data = data;

                elm.removeAttr("state");
                elm.attr("ng-class", "[data.party, data.winner ? data.winner : 'not-voted']");
                elm.on('click', function() {
                    mapCtrl.click(data);
                });

                if(data.winner) {
                    var svg = elm.parent().parent()[0];
                    var winnerGroup = svg.getElementById('state-winners');
                    var logo = svg.getElementById(data.winner + '-logo');
                    var clone = logo.cloneNode();

                    // illustrator registration point is center, svg top left
                    var x = data.points.x;// + 27; // half the width
                    var y = data.points.y - 20.75; // half the height

                    clone.setAttribute('x', x);
                    clone.setAttribute('y', y);
                    clone.setAttribute('class', data.winner + ' ' +data.party);
                    clone.removeAttribute('id');

                    winnerGroup.appendChild(clone);
                }

                $compile(elm)(scope);
            }
        }]);
})();