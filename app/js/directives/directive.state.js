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
        var data   = _.find(StateData.states, {'abbv': elm.attr('id')});
        scope.data = data;

        elm.removeAttr("state");
        elm.attr("ng-class", "[data.party, data.winner ? data.winner : 'not-voted']");
        elm.on('click', click);

        if(data.winner) {
          var svg         = elm.parent().parent()[0];
          var winnerGroup = svg.getElementById('state-winners');
          var logo        = svg.getElementById('marker-' + data.winner);
          var clone       = logo.cloneNode();

          // illustrator registration point is center, svg top left
          var x = data.points.x;// + 27; // half the width
          var y = data.points.y - 20.75; // half the height

          clone = angular.element(clone);
          clone.attr('x', x);
          clone.attr('y', y);
          clone.attr('class', data.winner + ' ' + data.party);
          clone.removeAttr('id');
          clone.on('click', click);
          clone.on('transitionend', function(e) {
            if(e.propertyName === 'opacity') {
              var opacity = window.getComputedStyle(e.target).getPropertyValue(e.propertyName);
              e.target.style.pointerEvents = opacity==="1" ? 'auto' : 'none';
            }
          });

          winnerGroup.appendChild(clone[0]);
        }

        $compile(elm)(scope);

        function click() {
          mapCtrl.click(data);
        }
      }
    }]);
})();