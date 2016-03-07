var gulp           = require('gulp'),
    browserSync    = require('browser-sync').create(),
    sass           = require('gulp-sass'),
    concat         = require('gulp-concat'),
    mainBowerFiles = require('main-bower-files');

// Static Server + watching scss/html files
gulp.task('serve', ['bower', 'sass'], function () {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/sass/**/*.scss", ['sass']);
    gulp.watch('bower_components/**/*', ['bower']).on('change', browserSync.reload);
    gulp.watch("app/**/*.html").on('change', browserSync.reload);
    gulp.watch("app/js/**/*.js").on('change', browserSync.reload);
    gulp.watch("app/data.json").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src("app/sass/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

// Compile the Bower files
gulp.task('bower', function(){
    return gulp.src(mainBowerFiles())
        .pipe(concat('lib.js'))
        .pipe(gulp.dest("app/js"));
});

gulp.task('default', ['serve']);