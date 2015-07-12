var gulp = require('gulp');

var clean = require('gulp-clean'),
    copy = require('gulp-copy'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    crisper = require('gulp-crisper'),
    vulcanize = require('gulp-vulcanize'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    runSequence = require('gulp-run-sequence');

// Delete dist folder
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(plumber())
        .pipe(clean());
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
            abspath: '',
            inlineScripts: true,
            inlineCss: true,
            stripExcludes: false,
            excludes: ['//fonts.googleapis.com/*']
        }))
        .pipe(crisper())
        .pipe(gulp.dest('dist/html'));
});

// Tasks
gulp.task('default', function (callback) {
    runSequence(['concat', 'copy', 'vulcanize'], callback);
});

gulp.task('build', function (callback) {
    runSequence('clean', 'default', callback);
});

gulp.task('watch', function () {
    gulp.watch('app/manifest.json', ['copy']);
    gulp.watch('app/**/*.html', ['default']);
    gulp.watch('app/**/*.css', ['default']);
    gulp.watch('app/scripts/main.js', ['default']);
});

gulp.task('serve', ['build', 'watch']);
