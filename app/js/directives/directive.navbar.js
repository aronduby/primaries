(function() {
  'use strict';

  angular.module('primaries')
    .directive('navBar', function() {
      return {
        restrict: 'EA',
        templateUrl: 'partials/nav-bar.html',
        scope: {},
        bindToController: true,
        controller: ctrl,
        controllerAs: 'nav'
      }
    });

  ctrl.$inject = ['$rootScope'];
  function ctrl($rootScope) {
    var self = this;
    this.current = {};
    this.sections = [];


    var elements = document.querySelectorAll('[data-scroll-title]');
    _.each(elements, function(element) {
      self.sections.push({
        id: element.getAttribute('id'),
        title: element.getAttribute('data-scroll-title')
      });
    });

    this.current = this.sections[0];

    $rootScope.$on('duScrollspy:becameActive', function($event, $element, $target){
      $rootScope.$apply(function() {
        self.current = $element.scope().section;
      })

    });

  }


})();