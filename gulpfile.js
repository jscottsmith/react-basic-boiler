var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('browserify');
var babelify = require('babelify');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var source = require('vinyl-source-stream');
var watch = require('gulp-watch');

// Paths
// -------------------------
var paths = {
    build: 'build',
    buildJs:'build/js',
    buildCss: 'build/css',
    html: 'src/index.html',
    js: 'src/js/*',
    sass: 'src/sass/*',
    entry: 'src/js/app.jsx'
};

// Watch
// -------------------------
gulp.task('watch', function(){
    gulp.watch(paths.js, ['build-js']);
    gulp.watch(paths.html, ['copy-html']);
    gulp.watch(paths.sass, ['compile-scss']);
});

// Build
// -------------------------
gulp.task('build-js', function () {
    browserify({
        entries: paths.entry,
        extensions: ['.jsx', '.js'],
        debug: true
    })
    .transform(babelify, {presets: ['es2015', 'react']})
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest(paths.buildJs))
    .pipe(connect.reload());
});

// Html
// -------------------------
gulp.task('copy-html', function () {
    return gulp
        .src(paths.html)
        .pipe(gulp.dest(paths.build))
        .pipe(connect.reload());
});

// Sass Compile
// And Auto Prefixer
// -------------------------
gulp.task('compile-scss', function () {
    return gulp
        .src(paths.sass)
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest(paths.buildCss));
});

// Server
// -------------------------
gulp.task('connect', function() {
    connect.server({
        root: paths.build,
        livereload: true
    });
});

// Default Task
// -------------------------
gulp.task('default', ['build-js', 'copy-html', 'compile-scss', 'watch', 'connect']);