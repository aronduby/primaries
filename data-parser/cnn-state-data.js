/**
 * Parses state delegate information from CNN
 * this only needs to be ran once
 *
 */
var fs      = require('fs');
var request = require('superagent');
var debug   = require('debug')('parser');
var q       = require('q');
var _       = require('lodash');

var cnn      = 'http://data.cnn.com/elections/2016/config.json';
var dataPath = '../app/data.json';
var outPath  = dataPath;// './test.json';

var cnnPromise   = requestData(cnn);
var localPromise = parseData(dataPath);

q.all([cnnPromise, localPromise])
  .spread(function(cnnData, localData) {

    cnnData.data.geographicalStates.forEach(function(cnnState) {
      var localState = _.find(localData, {id: cnnState.short});
      if(!localState) {
        debug('could not find local state: ' + cnnState.short);
        return false;
      }

      var dem = _.find(cnnState.races, {party: 'Dem'});
      debug('found party', dem);

      localState.delegates.total = parseInt(dem.pledgedDelegates, 10);
    });

    debug('writing to file');
    fs.writeFile(outPath, JSON.stringify(localData, null, '  '));
    debug('done');

  })
  .catch(function(err) {
    console.error(err);
  });


/**
 * Loads JSON data from the supplied url
 *
 * @param url
 * @returns {*|h.promise|promise}
 */
function requestData(url) {
  var defer = q.defer();

  request
    .get(url)
    .end(function(err, rsp) {
      if(err) {
        console.log(err);
        defer.reject(err);
      }

      defer.resolve(rsp.body);
    });

  return defer.promise;
}


/**
 * Loads and parses JSON data from supplied local file
 *
 * @param path
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