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
var argv   = require('yargs').argv;

var cnn          = 'http://data.cnn.com/ELECTION/2016primary/full/D.json';
var dataPath     = '../app/data.json';
var outPath      = dataPath; // './test.json';
var candidateMap = {
  1445: 'sanders',
  1746: 'clinton'
};


updated(dataPath, cnn)
  .then(function(updated) {
    debug('updated: ', updated);
    if(argv.force) {
      updated = true;
      debug('forcing run regardless');
    }

    if(updated) {

      q.all([requestData(cnn), parseData(dataPath)])
        .spread(function(cnnData, localData) {

          cnnData.states.forEach(function(cnnState) {
            var localState = _.find(localData, {id: cnnState.code});
            if(!localState) {
              debug('could not find local state: ' + cnnState.code);
              return false;
            }

            if(cnnState.electiondate === "") {
              debug('state not voted yet', cnnState.code);
              return true;
            }

            cnnState.candidates.forEach(function(candidate) {
              var key = _.get(candidateMap, candidate.id, false);
              if(key === false) {
                console.log('unknown candidate: ', candidate.id);
                return false;
              }

              debug(candidate);
              localState.delegates[key] = parseInt(candidate.rd, 10);
              if(candidate.winner === true) {
                localState.winner = key;
              }
            });
          });

          debug('writing to file');
          fs.writeFile(outPath, JSON.stringify(localData, null, '  '));
          debug('done');

        })
        .catch(function(err) {
          console.error(err);
        });

    } else {
      console.log('url not updated since last file modification');
    }
  })
  .catch(function(err) {
    console.error(err);
  });


function updated(local, url) {
  var defer = q.defer();

  q.all([getFileLastUpdated(local), getUrlModifiedTime(url)])
    .spread(function(fileModified, urlModified) {
      debug(fileModified, urlModified);

      fileModified = fileModified.getTime();
      urlModified  = urlModified.getTime();

      defer.resolve(urlModified > fileModified);
    })
    .catch(function(err) {
      console.error(err);
      defer.reject(err);
    });

  return defer.promise;
}


function getFileLastUpdated(path) {
  var defer = q.defer();

  fs.lstat(path, function(err, data) {
    if(err) {
      defer.reject(err);
      return console.log(err);
    }

    defer.resolve(data.mtime);
  });

  return defer.promise;
}

function getUrlModifiedTime(url) {
  var defer = q.defer();

  request.head(url)
    .end(function(err, rsp) {
      if(err) {
        defer.reject(err);
        return console.error(err);
      }

      defer.resolve(new Date(rsp.header['last-modified']));
    });

  return defer.promise;
}


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