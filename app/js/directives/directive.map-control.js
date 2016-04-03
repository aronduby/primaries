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

  ctrl.$inject = ['StateData', '$uibModal'];
  function ctrl(StateData, $modal) {
    var filtered = StateData.states;

    this.party  = null;
    this.winner = null;

    this.setFilters = function() {
      var conditions = {};
      var party = parseVal(this.party);
      var winner = parseVal(this.winner);

      if(party){ conditions.party = party; }
      if(winner){ conditions.winner = winner; }

      filtered = _.filter(StateData.states, conditions);
    };

    this.stateClick = function(state) {
      $modal.open({
        templateUrl: 'partials/state-modal.html',
        controller: 'StateModalController',
        resolve: {
          state: function(){
            return state;
          },
          allStates: function() {
            return filtered;
          }
        }
      });
    };


  }

  function parseVal(val) {
    if(val == null) {
      return null;
    }

    return val.split('--')[1];
  }
})();
