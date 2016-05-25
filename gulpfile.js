var gulp          = require('gulp');  
var browserSync   = require('browser-sync').create();  
var rename        = require('gulp-rename');  
var plumber       = require('gulp-plumber');  
var jade          = require('gulp-jade');  
var affected      = require('gulp-jade-find-affected');  
var sass          = require('gulp-sass');  
var autoprefix    = require('gulp-autoprefixer');  
var cssnano       = require('gulp-cssnano');  
var jshint        = require('gulp-jshint');
var exec          = require('child_process').exec;
var surge         = require('gulp-surge');
var imagemin      = require('gulp-imagemin');

var _project_dist = './dist/';  
var _jade_src     = './src/views/**/!(_)*.jade';  
var _jade_dest    = './dist';  
var _jade_watch   = './src/views/**/*.jade';  
var _sass_src     = './src/sass/styles.sass';  
var _sass_dest    = './dist/css';  
var _sass_watch   = './src/sass/**/*.sass';  
var _js_src       = './src/js/**/*.js';  
var _js_dest      = './dist/js/';

var surge = require('gulp-surge')

gulp.task('images', () =>
	gulp.src('src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
);

gulp.task('deploy', [], function () {
  return surge({
    project: './dist',         
    domain: 'p1xt-tribute-nodejs.surge.sh'  
  });
});

gulp.task('lite-server', function (cb) {
  exec('npm run lite', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('jade', function() {  
  gulp.src(_jade_src)
    .pipe(plumber({
      errorHandler: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(affected())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(_jade_dest))
    .pipe(browserSync.stream());
});

gulp.task('sass', function() {  
  gulp.src(_sass_src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefix('last 2 versions'))
    .pipe(cssnano())
    .pipe(gulp.dest(_sass_dest))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {  
  gulp.src(_js_src)
     .pipe(jshint())
     .pipe(gulp.dest(_js_dest))
     .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', function() {  
    gulp.watch(_jade_watch , ['jade']);
    gulp.watch(_sass_watch , ['sass']);
    gulp.watch(_js_src     , ['js']);
});

gulp.task('server', ['jade', 'sass', 'js', 'images', 'watch', 'lite-server']);
gulp.task('default', ['jade', 'sass', 'js', 'images']);  
