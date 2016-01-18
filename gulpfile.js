var gulp          = require('gulp'),
    gutil         = require('gulp-util'),
    sass          = require('gulp-sass'),
    csso          = require('gulp-csso'),
    uglify        = require('gulp-uglify'),
    jade          = require('gulp-jade'),
    concat        = require('gulp-concat'),
    autoprefixer  = require('gulp-autoprefixer'),
    rename        = require('gulp-rename'),
    livereload    = require('gulp-livereload'),
    tinylr        = require('tiny-lr'),
    express       = require('express'),
    app           = express(),
    marked        = require('marked'), // For :markdown filter in jade
    path          = require('path'),
    server        = tinylr();

// --- Basic Tasks ---
gulp.task('vendor', function() {
  return gulp.src('source/vendor/stylesheets/*.css')
    .pipe( concat('vendor.css') )
    .pipe( gulp.dest('dist/stylesheets/') )
});

gulp.task('scss', function() {
  return gulp.src('source/assets/stylesheets/*.scss')
    .pipe(
      sass( {
        includePaths: ['source/assets/stylesheets'],
        errLogToConsole: true
      } ) )
    .pipe( autoprefixer('last 2 versions') )
    .pipe( gulp.dest('dist/stylesheets/') )
});

gulp.task('css', ['vendor', 'scss'], function() {
  return gulp.src(
      [
        'dist/stylesheets/vendor.css',
        'dist/stylesheets/base.css'
      ],
      { base: 'dist/' }
    )
    .pipe( csso() )
    .pipe( concat('application.min.css') )
    .pipe( gulp.dest('dist/stylesheets/') )
});

gulp.task('js', function() {
  return gulp.src('source/assets/javascripts/*.js')
    // .pipe( uglify().on('error', gutil.log) )
    .pipe( concat('application.js') )
    .pipe( gulp.dest('dist/javascripts/') )
});

gulp.task('templates', function() {
  return gulp.src('source/**/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe( gulp.dest('dist/') )
    .pipe( livereload(server) );
});

gulp.task('express', function() {
  app.use(express.static(path.resolve('./dist')));
  app.listen(1337);
  gutil.log('Listening on port: 1337');
});

gulp.task('watch', function () {
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }

    gulp.watch('source/stylesheets/**/*.scss', ['css']);

    gulp.watch('source/javascripts/*.js', ['js']);

    // gulp.watch('source/**/*.jade', ['templates']);

  });
});

// Default Task
gulp.task('default', ['js', 'css', 'express', 'watch']);
