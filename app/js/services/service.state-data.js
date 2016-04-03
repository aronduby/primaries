(function() {
  'use strict';

  angular.module('primaries')
    .service('StateData', function($http, $q, dataUrl) {
      var self    = this;
      self.lastModified = null;
      self.states = null;
      self.alpha = null;
      self.voted = null;
      self.filtered = null;

      this.fetch = function() {
        if(this.states) {
          return $q.when(this.states);
        }

        return $http.get(dataUrl)
          .then(
            function success(rsp) {
              self.lastModified = moment(rsp.headers('last-modified'));

              self.states = self.filtered = rsp.data;
              self.alpha = _.sortBy(self.states, 'name');
              self.voted = _.filter(self.states, 'winner');

              _.forEach(self.states, function(state) {
                state.primary.date = moment(state.primary.date, 'YYYY-M-D');
                state.delegates.percents = {
                  clinton: (state.delegates.clinton / state.delegates.total) * 100,
                  sanders: (state.delegates.sanders / state.delegates.total) * 100
                }
              });

            },
            function error(rsp) {
              console.error('Unable to load states', rsp);
            }
          );
      };

      this.previous = function(id) {
        var idx = _.findIndex(self.filtered, {'id': id});
        return _.get(self.filtered, '[' + --idx + ']', _.last(self.filtered));
      };

      this.next = function(id) {
        var idx = _.findIndex(self.filtered, {'id': id});
        return _.get(self.filtered, '[' + ++idx + ']', _.first(self.filtered));
      };

      this.filter = function(conditions) {
        self.filtered = _.filter(self.states, conditions);
      }

    });

})();