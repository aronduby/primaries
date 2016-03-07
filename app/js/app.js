(function(){
    'use strict';

    angular.module('primaries', ['ngRoute'])

        .value('dataUrl', 'data.json')
        .value('styleVarsUrl', 'css/vars/_variables.json')

        .config(config)
        .controller( 'MainController', function(states){

        });

    config.$inject = ['$routeProvider', 'StateDataProvider', 'StyleVariablesProvider'];
    function config($routeProvider, StateData, StyleVariables){
        var resolve = {
            states: function (StateData) {
                return StateData.fetch();
            },
            styleVars: function(StyleVariables) {
                return StyleVariables.fetch();
            }
        };

        $routeProvider
            .when('/', {
                controller: 'MainController as main',
                templateUrl: 'partials/main.html',
                resolve: resolve
            })
            .otherwise({
                redirectTo: '/'
            });
    }


})();