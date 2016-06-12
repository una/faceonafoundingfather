var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    rename      = require('gulp-rename'),
    cssmin      = require('gulp-minify-css'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    jshint      = require('gulp-jshint'),
    scsslint    = require('gulp-sass-lint'),
    cache       = require('gulp-cached'),
    prefix      = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    minifyHTML  = require('gulp-minify-html'),
    nodemon = require('gulp-nodemon'),
    size        = require('gulp-size'),
    gutil = require('gulp-util'),
    reload = browserSync.reload,
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    plumber     = require('gulp-plumber'),
    deploy      = require('gulp-gh-pages'),
    notify      = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps')
    webpack = require('webpack'),
    babel = require('gulp-babel');;

var nodeExternals = require('webpack-node-externals');

//Pack all server side JS
gulp.task('server-pack', (cb) => {
  webpack({
    devtool: 'source-maps',
    'target':'node',
    externals: [nodeExternals()],
    entry: './app.js',
    output: {
      path: './',
      filename: 'index.js'
    },
    module: {
      loaders: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loaders: ['babel'],
        },
      ],
    }
  }, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      progress: true,
      colors: true
    }));
    browserSync.reload();
    cb();
  });
});

gulp.task('scss', function() {
    var onError = function(err) {
      notify.onError({
          title:    "Gulp",
          subtitle: "Failure!",
          message:  "Error: <%= error.message %>",
          sound:    "Beep"
      })(err);
      this.emit('end');
  };

  return gulp.src('src/scss/main.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(prefix())
    .pipe(rename('main.css'))
    .pipe(gulp.dest('public/css'))

    .pipe(browserSync.stream())
    .pipe(cssmin())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('deploy', function () {
    return gulp.src('public/**/*')
        .pipe(deploy());
});

gulp.task('js', function() {
  gulp.src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({presets : ['es2015']}))
    .pipe(uglify())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(concat('j.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'));
    reload();
});

gulp.task('scss-lint', function() {
  gulp.src('src/scss/**/*.scss')
    .pipe(cache('scsslint'))
    .pipe(scsslint());
});

gulp.task('minify-html', function() {
    var opts = {
      comments:true,
      spare:true
    };

  gulp.src('src/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('public/'))
    .pipe(reload({stream:true}));
});

gulp.task('jshint', function() {
  gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {

  gulp.watch(['app.js', 'modules/**/*.js'], ['server-pack']);
  gulp.watch('src/scss/**/*.scss', ['scss']);
  gulp.watch('./src/js/*.js', ['jshint', 'js']).on('change', reload);
  gulp.watch('src/*.html', ['minify-html']).on('change', reload);
  gulp.watch('src/img/*', ['imgmin']).on('change', reload);
});

//////////////////////////////
// Nodemon Task
//////////////////////////////
gulp.task('nodemon', function (cb) {
  nodemon({
    'script': 'index.js',
    'watch': 'index.js',
    'env': {
      'NODE_ENV': 'development'
    }
  })
  .once('start', function () {
    cb();
  })
  .on('restart', function () {
    console.log('Restarted');
    reload();
  });
});

gulp.task('imgmin', function () {
    return gulp.src('src/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('public/img'));
});

//////////////////////////////
// Browser Sync Task
//////////////////////////////
gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init({
    port: 8000,
    proxy: 'http://localhost:3000/'
  });
});

gulp.task('build', ['server-pack', 'js', 'imgmin', 'minify-html', 'scss']);
gulp.task('default', ['browser-sync', 'build', 'watch']);
