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
                    var point = svg.getElementById(data.id + '-Point');
                    var xy = point.getAttribute('d').replace('M','').split(',');
                    var img = document.createElementNS("http://www.w3.org/2000/svg", 'image');

                    img.setAttribute('xlink:href', '/images/' + data.winner + '.png');
                    img.setAttribute('x', xy[0]);
                    img.setAttribute('y', xy[1]);
                    img.setAttribute('width', '50px');
                    img.setAttribute('height', '50px');

                    winnerGroup.appendChild(img);
                }

                $compile(elm)(scope);
            }
        }]);
})();