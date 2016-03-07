(function(){
    'use strict';

    angular.module('primaries', ['ngRoute'])

        .value('dataUrl', 'data.json')

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
                            deferred.resolve(self.states);
                        },
                        function error(rsp) {
                            alert('Unable to load states');
                            deferred.reject('Unable to load states');
                        }
                    );

                return deferred.promise;
            }
        })

        .config( function ($routeProvider) {
            var resolveStates = {
                states: function (StateData) {
                    return StateData.fetch();
                }
            };

            $routeProvider
                .when('/', {
                    controller: 'MainController as main',
                    templateUrl: 'partials/main.html',
                    resolve: resolveStates
                })
                .otherwise({
                    redirectTo: '/'
                });

        })

        .controller( 'MainController', function(states){

        });



})();