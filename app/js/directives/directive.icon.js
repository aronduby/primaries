(function() {

  angular.module('primaries')
    .directive('icon', function() {
      return {
        restrict: 'EA',
        templateUrl: 'partials/icon.html',
        scope: {
          src: '='
        },
        link: link,
        controllerAs: 'icon'
      };

      function link(scope, el, attr) {
        scope.id = '#icon-' + scope.src;

        scope.$watch('src', function(newVal, oldVal){
          console.log(arguments);
          scope.id = '#icon-' + newVal;
        });

      }
    });
})();