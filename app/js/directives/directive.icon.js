(function() {

    angular.module('primaries')
        .directive('icon', function() {
            return {
                restrict: 'EA',
                templateUrl: 'partials/icon.html',
                scope: {},
                bindToController: {
                    src: '='
                },
                controller: ctrl,
                controllerAs: 'icon'
            };

            function ctrl() {
                this.id = '#icon-' + this.src;
            }
        });
})();