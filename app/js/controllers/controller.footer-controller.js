(function(){
  'use strict';

  angular.module('primaries')
    .controller('FooterController', FooterController);

  FooterController.$inject = ['StateData'];
  function FooterController(StateData) {
    // since we set a different default calendar since most things don't have times
    // here we have to supply the default
    var calendarFormat = {
      lastDay: '[Yesterday at] LT',
      sameDay: '[Today at] LT',
      nextDay: '[Tomorrow at] LT',
      lastWeek: '[last] dddd [at] LT',
      nextWeek: 'dddd [at] LT',
      sameElse: 'L'
    };

    this.lastModified = StateData.lastModified;

    // amCalendar filter doesn't support passing in formats, so do this hacky setup
    this.lastModifiedDisplay = this.lastModified.calendar(null, calendarFormat);
  }


})();