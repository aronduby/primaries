(function() {

  angular.module('primaries')
    .controller('StateModalController', ctrl);

  ctrl.$inject = ['$scope', '$uibModalInstance', 'StateData', 'state', 'allStates'];
  function ctrl($scope, $instance, StateData, state, allStates) {
    var smvm = $scope.smvm = {};

    smvm.state = state;
    smvm.close = close;
    smvm.previous = previous;
    smvm.next = next;

    function previous() {
      var idx = _.findIndex(allStates, {'id': smvm.state.id});
      idx--;
      smvm.state = _.get(allStates, '[' + idx + ']', _.last(allStates));
    }

    function next() {
      var idx = _.findIndex(allStates, {'id': smvm.state.id});
      idx++;
      smvm.state = _.get(allStates, '[' + idx + ']', _.first(allStates));
    }

    function close() {
      $instance.close();
    }
  }

})();