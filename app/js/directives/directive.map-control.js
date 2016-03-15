(function() {
  'use strict';

  angular.module('primaries')
    .directive('mapControl', function() {
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
    });

  ctrl.$inject = ['StateData'];
  function ctrl(StateData) {
    this.party  = null;
    this.winner = null;

    this.setFilters = function() {
      var conditions = {};
      var party = parseVal(this.party);
      var winner = parseVal(this.winner);

      if(party){ conditions.party = party; }
      if(winner){ conditions.winner = winner; }

      StateData.filter(conditions);
    }
  }

  function parseVal(val) {
    if(val == null) {
      return null;
    }

    return val.split('--')[1];
  }
})();
