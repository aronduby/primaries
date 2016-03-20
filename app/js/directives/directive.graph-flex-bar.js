(function() {
  'use strict';

  angular.module('primaries')
    .directive('graphFlexBar', function() {
      return {
        restrict: 'EA',
        templateUrl: 'partials/graph-flex-bar.html',
        scope: {},
        bindToController: {
          orientation: '=',
          data: '=',
          tmpl: '=',
          click: '&'
        },
        controller: ctrl,
        controllerAs: 'graph'
      }
    });

  ctrl.$inject = ['$templateCache', '$sce'];
  function ctrl($templateCache, $sce) {

    // do we have a template?
    if(!_.isEmpty(this.tmpl)) {
      var tpl      = $templateCache.get(this.tmpl);
      var compiler = _.template(tpl, {
        interpolate: /{{([\s\S]+?)}}/g
      });

      _.each(this.data, function(d) {
        d.compiled = $sce.trustAsHtml(compiler(d.data));
      });
    }

    this.clicked = function(data) {
      this.click({data: data.data});
    }

  }


})();