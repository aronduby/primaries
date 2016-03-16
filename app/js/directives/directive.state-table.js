(function() {

  angular.module('primaries')
    .directive('stateTable', stateTable);

  stateTable.$inject = [];
  function stateTable(){
    return {
      restrict: 'E',
      templateUrl: 'partials/state-table.html',
      transclude: true,
      scope: {},
      bindToController: {},
      controller: ctrl,
      controllerAs: 'stvm'
    };
  }

  ctrl.$inject = ['StateData'];
  function ctrl(StateData) {
    var self = this;
    this.showing = false;
    this.states = _.orderBy(StateData.states, 'name');
    this.totals = {
      clinton: _.sumBy(self.states, 'delegates.clinton'),
      sanders: _.sumBy(self.states, 'delegates.sanders')
    };

    this.toggleTable = function() {
      this.showing = !this.showing;
    }
  }

})();