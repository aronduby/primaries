(function(){
  'use strict';

  angular.module('primaries')
    .controller('DelegateController', DelegateController);

  DelegateController.$inject = ['DelegatesToWin', 'StateData'];
  function DelegateController(DelegatesToWin, StateData) {
    var clintonTotal = _.sumBy(StateData.states, 'delegates.clinton');
    var sandersTotal = _.sumBy(StateData.states, 'delegates.sanders');

    this.data = {
      total: DelegatesToWin,
      left: {
        classes: 'clinton',
        total: clintonTotal,
        percent: Math.round((clintonTotal / DelegatesToWin) * 100)
      },
      right: {
        classes: 'sanders',
        total: sandersTotal,
        percent: Math.round((sandersTotal / DelegatesToWin) * 100)
      }
    };

    this.leader = clintonTotal > sandersTotal ? 'clinton' : 'sanders';
    this.delegatesToWin = DelegatesToWin;
    this.clinton = this.data.left;
    this.sanders = this.data.right;

  }


})();