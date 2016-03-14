(function() {

  angular.module('primaries')
    .controller('StateModalController', ctrl);

  ctrl.$inject = ['$scope', '$uibModalInstance', 'StateData', 'state'];
  function ctrl($scope, $instance, StateData, state) {
    var smvm = $scope.smvm = {};
    smvm.state = state;
    smvm.close = close;
    smvm.previous = previous;
    smvm.next = next;

    console.log(state);

    function previous(){
      smvm.state = StateData.previous(smvm.state.id);
    }

    function next(){
      smvm.state = StateData.next(smvm.state.id);
    }

    function close() {
      $instance.close();
    }
  }

})();