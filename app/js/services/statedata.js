(function(){
    'use strict';

    angular.module('primaries')
    .service('StateData', function ($http, $q, dataUrl) {
        var self = this;
        self.states = null;

        this.fetch = function () {
            if (this.states) {
                return $q.when(this.states);
            }

            var deferred = $q.defer();

            $http.get(dataUrl)
                .then(
                    function success(rsp) {
                        self.states = rsp.data;
                        _.forEach(self.states, function(state){
                           state.primaryDate = moment(state.primaryDate);
                        });
                        deferred.resolve(self.states);
                    },
                    function error(rsp) {
                        console.error('Unable to load states');
                        deferred.reject('Unable to load states');
                    }
                );

            return deferred.promise;
        }
    })

})();