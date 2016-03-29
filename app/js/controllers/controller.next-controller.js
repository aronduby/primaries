(function(){
  'use strict';

  angular.module('primaries')
    .controller('NextController', ctrl);

  ctrl.$inject = ['StateData'];
  function ctrl(StateData) {
    var today = moment().startOf('day').unix();
    var self = this;

    this.upcoming = [];

    var groupedByDate = _(StateData.states)
      .sortBy('primary.date')
      .filter(function(state) {
        return today <= state.primary.date.unix();
      })
      .tap(function(val) {
        self.upcoming = val;
      })
      .groupBy('primary.date')
      .value();


    this.date = moment(_.keys(groupedByDate)[0], 'ddd MMM DD YYYY HH:mm:ss Z');
    this.states = groupedByDate[ this.date ];

    this.toggleTable = function() {
      this.showing = !this.showing;
    };

    this.isDateRepeated = function(state, idx) {
      if(!idx) {
        return false;
      }

      return state.primary.date.unix() == self.upcoming[--idx].primary.date.unix();
    };
  }
})();