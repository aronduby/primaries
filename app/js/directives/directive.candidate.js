(function() {
    'use strict';

    angular.module('primaries')
        .directive('candidate', ['StateData', function(StateData) {
            return {
                restrict: 'EA',
                templateUrl: 'partials/candidate.html',
                scope: {},
                bindToController: {
                    key: '=',
                    name: '='
                },
                controller: ctrl,
                controllerAs: 'cvm',
                link: link
            };

            function link(scope, elm, attr) {

            }

            function ctrl() {
                var wins = _.filter(StateData.states, {'winner': this.key});
                var self = this;
                this.data = {};

                // totals
                _.set(this.data, 'total.states', wins.length);
                _.set(this.data, 'total.delegates', _.sumBy(wins, 'delegates.' + this.key));

                var parties = ['republican', 'democrat', 'swing'];
                parties.forEach(function(party) {
                    var filtered = _.filter(wins, {'party': party});
                    _.set(self.data, party+'.states', filtered.length);
                    _.set(self.data, party+'.delegates', _.sumBy(filtered, 'delegates.' + self.key));
                    _.set(self.data, party+'.electoral', _.sumBy(filtered, 'electoralVotes'));
                });

                _.set(self.data, 'notRepublican.states', self.data.democrat.states + self.data.swing.states);
                _.set(self.data, 'notRepublican.delegates', self.data.democrat.delegates + self.data.swing.delegates);
                _.set(self.data, 'electoralVotes', _.sum([self.data.democrat.electoral, self.data.swing.electoral]));
            }

        }]);
})();