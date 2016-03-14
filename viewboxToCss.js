var xray    = require('x-ray');
var cheerio = require('x-ray/node_modules/cheerio');
var path    = require('path');
var gutil   = require('gulp-util');
var through = require('through2');
var sprintf = require('sprintf-js').sprintf;

const PLUGIN_NAME = 'gulp-viewboxToSass';

cheerio.prototype.options.xmlMode = true;


function viewboxToSass(filename) {
  if(!filename) {
    throw new gutil.PluginError(PLUGIN_NAME, 'Missing filename!');
  }

  return through.obj(function(file, enc, cb) {
    if(file.isNull()) {
      return cb(null, file);
    }

    if(file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streams are not supported!'))
    }

    parseSymbols(file.contents.toString(), function(err, sass){
      if(err){
        cb(new gutil.PluginError(PLUGIN_NAME, 'Error parsing SVG: ' + err));
      }

      var sassFile = new gutil.File({
        path: filename,
        contents: new Buffer(sass)
      });

      cb(null, sassFile);
    });
  });

}

function parseSymbols(content, cb) {

  var x = xray();
  x(content, 'symbol', [{
    id: '@id',
    viewbox: '@viewBox'
  }])
  (function(err, data) {
    if(err) {
      return cb(err);
    }

    var sass = '';
    data.forEach(function(d){
      var parts = d.viewbox.split(' ');
      var id = d.id;
      var w = Math.round(parts[2]);
      var h = Math.round(parts[3]);

      sass += sprintf('.%s { width: %dpx; height: %dpx; }', id, w, h);
    });

    cb(null, sass);
  });
}

module.exports = viewboxToSass;