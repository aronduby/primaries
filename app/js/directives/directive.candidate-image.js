(function(){

    angular.module('primaries')
        .directive('candidateImage', [function() {
            return {
                restrict: 'EA',
                templateUrl: 'partials/candidate-image.html',
                scope: {},
                bindToController: {
                    key: '='
                },
                controller: controller,
                controllerAs: 'civm'
            }
        }]);

        function controller() {
            switch (this.key) {
                case 'sanders':
                    this.name = 'Bernie Sanders';
                    break;
                case 'clinton':
                    this.name = 'Hillary Clinton';
                    break;
            }
        }

})();
