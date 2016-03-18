var gulp           = require('gulp'),
    browserSync    = require('browser-sync').create(),
    sass           = require('gulp-sass'),
    sourcemaps     = require('gulp-sourcemaps'),
    autoprefixer   = require('gulp-autoprefixer'),
    concat         = require('gulp-concat'),
    mainBowerFiles = require('main-bower-files'),
    sassJson       = require('gulp-sass-json'),
    inject         = require('gulp-inject'),
    rename         = require('gulp-rename'),
    svgstore       = require('gulp-svgstore'),
    svgmin         = require('gulp-svgmin'),
    path           = require('path'),
    es             = require('event-stream'),
    viewboxToSass  = require('./viewboxToCss');

// Static Server + watching scss/html files
gulp.task('serve', ['bower', 'sass', 'sass-json'], function() {

  browserSync.init({
    server: "./app"
  });

  gulp.watch("app/sass/**/*.scss", ['sass', 'sass-json']);
  gulp.watch('bower_components/**/*', ['bower']).on('change', browserSync.reload);
  gulp.watch("app/**/*.html").on('change', browserSync.reload);
  gulp.watch("app/icons/*.svg", ['viewboxToSass', 'inject']).on('change', browserSync.reload);
  gulp.watch("app/js/**/*.js", ['inject']).on('change', browserSync.reload);
  gulp.watch("app/data.json").on('change', browserSync.reload);
  gulp.watch("images/states.svg").on('change', browserSync.reload);
});

gulp.task('viewboxToSass', ['icons'], function() {
  return gulp.src('app/images/icons.svg')
    .pipe(viewboxToSass('_icons.scss'))
    .pipe(gulp.dest('./app/sass'));
});

gulp.task('icons', function() {
  var icons = gulp
    .src('app/icons/*.svg')
    .pipe(rename({prefix: 'icon-'}))
    .pipe(svgmin(function(file) {
      var prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
        }]
      }
    }))
    .pipe(svgstore({inlineSvg: true}))
    .pipe(gulp.dest('./app/images'));

  function fileContents(filePath, file) {
    return file.contents.toString();
  }

  return gulp
    .src('./app/src.html')
    .pipe(inject(icons, {transform: fileContents}))
    .pipe(gulp.dest('./app'));
});

// inject our angular services and directives
gulp.task('inject', function() {
  return gulp.src('app/src.html')
    .pipe(inject(
      gulp.src(
        ['app/js/modals/**/*.js', 'app/js/services/**/*.js', 'app/js/directives/**/*.js', 'app/js/controllers/**/*.js'],
        {read: false}
      ),
      {relative: true}
    ))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./app'));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("app/sass/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
});

// Grabs variables out of Sass and saves them as JSON
gulp.task('sass-json', function() {
  return gulp
    .src('app/sass/_variables.scss')
    .pipe(sassJson())
    .pipe(gulp.dest('app/css/vars'));
});

// Compile the Bower files
gulp.task('bower', function() {
  return gulp.src(mainBowerFiles())
    .pipe(concat('lib.js'))
    .pipe(gulp.dest("app/js"));
});

gulp.task('default', ['serve']);