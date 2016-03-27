(function() {
  'use strict';

  angular.module('primaries')
    .service('StateUrls', urlService)
    .filter('urls', urlFilters);


  function urlService() {
    return {
      history: _.template('http://www.270towin.com/states/<% print( _.snakeCase(name) ); %>'),
      nyt: _.template('http://www.nytimes.com/elections/results/<% print( _.kebabCase(name) ); %>'),
      cnn: _.template('http://www.cnn.com/election/primaries/states/<% print( _.lowerCase(abbv) ); %>/Dem')
    };
  }

  urlFilters.$inject = ['StateUrls'];
  function urlFilters(StateUrls) {
    return function(input, type) {
      return StateUrls[type](input);
    }
  }

})();