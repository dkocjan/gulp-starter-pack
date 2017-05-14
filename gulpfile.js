const gulp         = require('gulp'),
      browserSync  = require('browser-sync'),
      sass         = require('gulp-sass'),
      path         = require('path'),
      sourcemaps   = require('gulp-sourcemaps'),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS     = require('gulp-clean-css'),
      uglify       = require('gulp-uglify'),
      concat       = require('gulp-concat'),
      imagemin     = require('gulp-imagemin'),
      changed      = require('gulp-changed'),
      htmlReplace  = require('gulp-html-replace'),
      htmlMin      = require('gulp-htmlmin'),
      del          = require('del'),
      sequence     = require('run-sequence')

const config = {
  dist:          'dist/',
  src:           'src/',
  cssin:         'src/css/**/*.css',
  jsin:          'src/js/**/*.js',
  imgin:         'src/img/**/*.{jpg,jpeg,png,gif}',
  htmlin:        'src/**/*.html',
  scssin:        'src/scss/**/*.scss',
  scssmain:      'src/scss/styles.scss',
  scssout:       'src/css/',
  cssout:        'dist/css/',
  cssoutname:    'styles.css',
  jsout:         'dist/js/',
  imgout:        'dist/img/',
  htmlout:       'dist/',
  jsoutname:     'index.js',
  cssreplaceout: 'css/styles.css',
  jsreplaceout:  'js/index.js'
}

gulp.task('reload', function () {
  browserSync.reload()
})

gulp.task('serve', [ 'sass' ], function () {
  browserSync({ server: config.src })
  gulp.watch([
    config.htmlin,
    config.jsin
  ], [ 'reload' ])
  gulp.watch(config.scssin, [ 'sass' ])
})

gulp.task('sass', function () {
  return gulp.src(config.scssmain)
    .pipe(sourcemaps.init())
    .pipe(sass({
      onError: browserSync.notify
    }))
    .pipe(autoprefixer([
      'last 15 versions',
      '> 1%',
      'ie 8',
      'ie 7'
    ], { cascade: true }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.scssout))
    .pipe(browserSync.stream())
})

gulp.task('css', function () {
  return gulp.src(config.cssin)
    .pipe(concat(config.cssoutname))
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.cssout))
})

gulp.task('js', function () {
  return gulp.src(config.jsin)
    // .pipe(concat(config.jsoutname))
    // .pipe(uglify())
    .pipe(gulp.dest(config.jsout))
})

gulp.task('img', function () {
  return gulp.src(config.imgin)
    .pipe(changed(config.imgout))
    .pipe(imagemin())
    .pipe(gulp.dest(config.imgout))
})

gulp.task('html', function () {
  return gulp.src(config.htmlin)
    .pipe(htmlReplace({
      'js':  config.jsreplaceout,
      'css': config.cssreplaceout
    }))
    .pipe(htmlMin({
      sortAttributes:     true,
      sortClassName:      true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(config.dist))
})

gulp.task('del', function () {
  return del([ config.dist ])
})

gulp.task('build', function () {
  sequence('del', [
    'html',
    'js',
    'css',
    'img'
  ])
})

gulp.task('default', [ 'serve' ])
