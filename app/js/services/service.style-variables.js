(function(){
    'use strict';

    angular.module('primaries')
    .service('StyleVariables', function ($http, $q, styleVarsUrl) {
        var self = this;
        self.vars = null;

        this.fetch = function () {
            if (this.states) {
                return $q.when(this.states);
            }

            return $http.get(styleVarsUrl)
                .then(
                    function success(rsp) {
                        self.vars = rsp.data;
                    },
                    function error(rsp) {
                        console.error('Unable to load states');
                    }
                );
        }
    })

})();