(function(){
  'use strict';

  angular.module('primaries')
    .controller('LatestController', ctrl);

  ctrl.$inject = ['StateData'];
  function ctrl(StateData) {
    var now = moment();

    this.latest = _(StateData.states)
      .filter(function(state) {
        return state.primary.date < now
          && state.winner != null;
      })
      .sortBy('primary.date')
      .takeRight(5)
      .value();
  }
})();