const { src, dest, parallel, watch, series} = require('gulp');
const browsersync = require("browser-sync").create();
const sass = require('gulp-sass');
const minifCSS = require('gulp-csso')
const uglify = require('gulp-uglify');
const autoprefix = require('gulp-autoprefixer');
const pug = require('gulp-pug');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const archive = require('gulp-zip');
const webpackStream = require('webpack-stream');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./dist/"
    },
    port: 3000,
    open: false
  });
  done();
}
// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}
function pugHtml() {
  return src('./src/pug/pages/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest('./dist'))
}
function styles() {
  return src('./src/sass/main.sass')
    .pipe(plumber({
      errorHandler: function (err) {
        notify.onError({
          title: "Gulp error in " + err.plugin,
          message: err.toString()
        })(err);
      }
    }))
    .pipe(sass())
    .pipe(minifCSS())
    .pipe(autoprefix({
      browsers: ['last 6 versions']
    }))
    .pipe(rename({
      basename: "main",
      suffix: ".min",
    }))
    .pipe(dest('./dist/css')),

    src('./src/css/assets/**/*.css')
    .pipe(concat('vendor.min.css'))
    .pipe(dest('./dist/css/assets'))
    .pipe(browsersync.stream())
};


function js() {
  return src('./src/js/main.js')
    .pipe(webpackStream({
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
              presets: ["@babel/preset-env"]
            }
          }
        ]
      },
      externals: {
        jquery: 'jQuery'
      }
    }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('./dist/js')),

    src('./src/js/assets/**/*.js')
    // .pipe(babel({
    //   presets: ['@babel/env']
    // }))
    // .pipe(uglify())
    .pipe(concat('vendor.min.js'))
    .pipe(dest('./dist/js/assets'))
    .pipe(browsersync.stream()),

     src('./src/js/assets-header/**/*.js')
    .pipe(concat('vendor-header.min.js'))
    .pipe(dest('./dist/js/assets'))
    .pipe(browsersync.stream())
};

function image() {
  return src('./src/img/**/*')
    .pipe(dest('./dist/img'))
};

function fonts() {
  return src('./src/fonts/**/*.*')
    .pipe(dest(('./dist/fonts')))
}

function watcher() {
  watch('./src/css/**/*.css', series(styles, browserSyncReload));
  watch('./src/sass/**/*.sass', series(styles, browserSyncReload));
  watch('./src/js/**/*.js', series(js, browserSyncReload));
  watch('./src/img/**/*', series(image, browserSyncReload));
  watch('./src/fonts/**/*',series(fonts, browserSyncReload));
  watch('./src/pug/**/*.pug', series(pugHtml, browserSyncReload))
};


function zip() {
  return src('./dist/**/*')
    .pipe(archive('build.zip'))
    .pipe(dest('./dist'))
}

exports.js = js;
exports.styles = styles;
exports.fonts = fonts;
exports.watcher = watcher;
exports.image = image;
exports.pugHtml = pugHtml;

exports.build = parallel(js, styles, fonts, image, pugHtml)
exports.zip = series(zip)
exports.default = parallel(watcher, browserSync) 