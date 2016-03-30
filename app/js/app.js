(function() {
  'use strict';

  angular.module('primaries', ['ngRoute', 'ui.bootstrap', 'angularMoment', 'duScroll'])

    .value('dataUrl', 'data.json')
    .value('styleVarsUrl', 'css/vars/_variables.json')
    .value('DelegatesToWin', 2383)
    .value('ElectoralVotesToWin', 270)

    .value('duStopPropagation', false)
    .value('duScrollOffset', 45)

    .config(config)
    .controller('MainController', function(states) {

    });

  config.$inject = ['$routeProvider', 'StateDataProvider', 'StyleVariablesProvider', 'moment'];
  function config($routeProvider, StateData, StyleVariables, moment) {

    moment.localeData()._calendar = {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'MMMM Do'
    };


    var resolve = {
      states: function(StateData) {
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