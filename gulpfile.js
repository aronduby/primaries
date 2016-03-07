var gulp           = require('gulp'),
    browserSync    = require('browser-sync').create(),
    sass           = require('gulp-sass'),
    concat         = require('gulp-concat'),
    mainBowerFiles = require('main-bower-files'),
    sassJson       = require('gulp-sass-json');

// Static Server + watching scss/html files
gulp.task('serve', ['bower', 'sass', 'sass-json'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/sass/**/*.scss", ['sass', 'sass-json']);
    gulp.watch('bower_components/**/*', ['bower']).on('change', browserSync.reload);
    gulp.watch("app/**/*.html").on('change', browserSync.reload);
    gulp.watch("app/js/**/*.js").on('change', browserSync.reload);
    gulp.watch("app/data.json").on('change', browserSync.reload);
    gulp.watch("images/states.svg").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/sass/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

// Grabs variables out of Sass and saves them as JSON
gulp.task('sass-json', function () {
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