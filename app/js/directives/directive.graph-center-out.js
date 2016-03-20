(function(){
  'use strict';

  angular.module('primaries')
    .directive('graphCenterOut', function() {
      return {
        restrict: 'EA',
        templateUrl: 'partials/graph-center-out.html',
        scope: {},
        bindToController: {
          data: '='
        },
        controller: ctrl,
        controllerAs: 'graph'
      }
    });

  function ctrl() {
    
  }


})();