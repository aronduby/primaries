var xray  = require('x-ray');
var fs    = require('fs');
var q     = require('q');
var debug = require('debug');
var _     = require('lodash');

var srcPath  = './src.html';
var dataPath = '../app/data.json';

var src  = parseSrc(srcPath);
var data = parseData(dataPath);

q.all([src, data])
  .spread(function(src, data) {
    var combineDebug = debug('parser:combine');
    var statesByName = _.keyBy(data, 'name');

    // combineDebug('statesByName: ', statesByName);

    src.forEach(function(d) {
      if(_.has(statesByName, d.name)) {
        var state = statesByName[d.name];

        state.primary.date      = d.date;
        state.resultsUrl   = d.link;
        state.delegates.clinton = d.clinton;
        state.delegates.sanders = d.sanders;
        state.delegates.total   = d.total;

        combineDebug('set state to: ', state);

      } else {
        combineDebug('Could not find "' + d.name + '" in data file');
      }
    });

    combineDebug('writing to file');
    fs.writeFile(dataPath, JSON.stringify(data, null, '  '));
    combineDebug('done');
  })
  .catch(function(err) {
    console.error(err);
  });


/**
 * Get the data from the source
 * @returns {*|h.promise|promise}
 */
function parseSrc(path) {
  var defer = q.defer();
  var parseDebug = debug('parser:parse');

  fs.readFile(path, 'utf8', function(err, data) {
    if(err) {
      defer.reject(err);
      return;
    }
    parseDebug('loaded ' + path);

    var x = xray();
    x(data, '.g-republican-table table.g-results-table tr.g-row-results', [{
      classes: '@class',
      date: '.g-date-text',
      link: 'td.g-state a@href',
      name: 'td.g-state .g-fullname',
      clinton: '.g-Clinton',
      sanders: '.g-Sanders'
    }])
    (function(err, data) {
      if(err) {
        defer.reject(err);
        return;
      }

      // parse the scrapped results
      var lastDate   = null;
      var demResults = [];
      data.forEach(function(row) {
        if(row.date) {
          if(lastDate != row.date) {
            lastDate = row.date;
          }
        } else {
          row.date = lastDate;
        }


        // skip republican only rows
        if(row.classes.indexOf('g-row-republican') >= 0) {
          parseDebug('skipping republican row ' + row.name);
          return;
        }

        delete row.classes;
        row.clinton = parseInt(row.clinton, 10);
        row.sanders = parseInt(row.sanders, 10);
        row.clinton = isNaN(row.clinton) ? 0 : row.clinton;
        row.sanders = isNaN(row.sanders) ? 0 : row.sanders;
        row.total   = row.clinton + row.sanders;

        var d    = new Date(row.date + ' ' + (new Date().getFullYear()));
        row.date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

        demResults.push(row);
        parseDebug('parsed ', row);
      });

      defer.resolve(demResults);
    });
  });

  return defer.promise;
}

/**
 * Parses the JSON data file for the app
 * @returns {*|h.promise|promise}
 */
function parseData(path) {
  var defer = q.defer();

  fs.readFile(path, 'utf8', function(err, data) {
    if(err) {
      defer.reject(err);
      return;
    }

    defer.resolve(JSON.parse(data));
  });

  return defer.promise;
}