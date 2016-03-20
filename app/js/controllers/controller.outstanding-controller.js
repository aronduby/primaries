(function(){
  'use strict';

  angular.module('primaries')
    .controller('OutstandingController', OutstandingController);

  OutstandingController.$inject = ['DelegatesToWin', 'StateData'];
  function OutstandingController(DelegatesToWin, StateData) {

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

    // top 3
    this.largest = _(this.states)
      .orderBy('delegates.total', 'desc')
      .take(3)
      .value();

    // format data for the graph
    this.graphData = _.map(this.states, function(state){
      return {
        classes: 'state--' + state.party,
        value: state.delegates.total,
        title: state.name + ' - ' + state.delegates.total,
        data: state
      }
    });

    this.click = function(data) {
      console.log(data);
    }
  }


})();