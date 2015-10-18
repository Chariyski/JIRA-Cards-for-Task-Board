var gulp = require('gulp');

var clean = require('gulp-clean'),
    copy = require('gulp-copy'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    crisper = require('gulp-crisper'),
    vulcanize = require('gulp-vulcanize'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    runSequence = require('gulp-run-sequence'),
    path = require('path'),
    less = require('gulp-less'),
    zip = require('gulp-zip');

// Delete dist folder
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(plumber())
        .pipe(clean());
});

gulp.task('less', function () {
    return gulp.src('app/styles/less/main.less')
        .pipe(less())
        .pipe(gulp.dest('app/styles/'));
});

// Concatenate all JS files that are needed for distribution
gulp.task('concat', function () {
    return gulp.src([
        'bower_components/webcomponentsjs/webcomponents-lite.min.js'
    ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/scripts'));
});

// Copy all files that are needed for distribution
gulp.task('copy', function () {
    return gulp.src(
        ['manifest.json',
            'images/*.*',
            'fonts/*.*',
            'scripts/**/*.*',
            'styles/main.css',
            'index.html'
        ], {cwd: 'app'})
        .pipe(plumber())
        .pipe(copy('dist'));
});

// Preprocessed HTML files
gulp.task('vulcanize', function () {
    return gulp.src('app/html/elements.html')
        .pipe(plumber())
        .pipe(vulcanize({
            inlineScripts: true,
            inlineCss: true,
            stripExcludes: false,
            excludes: ['//fonts.googleapis.com/*']
        }))
        .pipe(crisper())
        .pipe(gulp.dest('dist/html'));
});

gulp.task('zip', function () {
    return gulp.src('dist/*')
        .pipe(zip('package.zip'))
        .pipe(gulp.dest('webstore'));
});

gulp.task('watch', function () {
    gulp.watch('app/manifest.json', ['copy']);
    gulp.watch('app/**/*.html', ['default']);
    gulp.watch('app/styles/**/*.less', ['default']);
    gulp.watch('app/**/*.css', ['default']);
    gulp.watch('app/scripts/main.js', ['default']);
});

// Tasks
gulp.task('default', function (callback) {
    runSequence('clean', ['less'], ['concat'], ['copy'], ['vulcanize'], callback);
});

gulp.task('dist', function () {
    runSequence('default', 'zip');
});

gulp.task('serve', ['default', 'watch']);
