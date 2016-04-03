(function(){
  'use strict';

  angular.module('primaries')
    .controller('OutstandingController', OutstandingController);

  OutstandingController.$inject = ['DelegatesToWin', 'StateData', '$uibModal'];
  function OutstandingController(DelegatesToWin, StateData, $modal) {
    var self = this;
    var sort = ['democrat', 'swing', 'republican'];

    this.states = _(StateData.states)
      .filter({'winner': null})
      .sortBy(function(s) {
        return _.indexOf(sort, s.party);
      })
      .value();

    // calculate the totals data
    this.total = _.sumBy(this.states, 'delegates.total');
    this.totals = {
      democrat: _(this.states).filter({'party': 'democrat'}).sumBy('delegates.total'),
      republican: _(this.states).filter({'party': 'republican'}).sumBy('delegates.total'),
      swing: _(this.states).filter({'party': 'swing'}).sumBy('delegates.total')
    };

    this.percents = {
      democrat: (this.totals.democrat / this.total) * 100,
      republican: (this.totals.republican / this.total) * 100,
      swing: (this.totals.swing / this.total) * 100
    };

    // format data for the graph
    this.graphData = _.map(this.states, function(state){
      return {
        classes: 'state--' + state.party,
        value: state.delegates.total,
        title: state.name + ' - ' + state.delegates.total,
        data: state
      }
    });

    this.click = function(state) {
      $modal.open({
        templateUrl: 'partials/state-modal.html',
        controller: 'StateModalController',
        resolve: {
          state: function(){
            return state;
          },
          allStates: function() {
            return self.states;
          }
        }
      });
    }
  }


})();