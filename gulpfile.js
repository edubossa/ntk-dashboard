var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var appAdminFolder = './app';
var componentsFolder = './node_modules';

var lessFiles = [appAdminFolder + '/app.less'];
var cssFiles = [componentsFolder + '/animate.css/animate.min.css'];
var jsFiles = [appAdminFolder + '/app.js',
    appAdminFolder + '/dashboard/dashboard.js',
    appAdminFolder + '/services/*.js'
];
var jsVendorFiles = [
    componentsFolder + '/jquery/dist/jquery.min.js',
    componentsFolder + '/toastr/build/toastr.min.js',
    componentsFolder + '/moment/min/moment.min.js',
    componentsFolder + '/moment/locale/pt-br.js',
    componentsFolder + '/checklist-model/checklist-model.js',
    componentsFolder + '/chart.js/dist/Chart.js',
    appAdminFolder + '/components/bootstrap/js/bs.min.js',
    appAdminFolder + '/i18n/angular-locale_pt-br.js',
    appAdminFolder + '/util.js',
];

// build admin
gulp.task('style', function() {
    var lessStream = gulp.src(lessFiles)
        .pipe(less())
        .pipe(concat('less-files.less'))
        .on('error', gutil.log);

    var cssStream = gulp.src(cssFiles)
        .pipe(concat('css-files.css'))
        .on('error', gutil.log);

    var mergedStream = merge(lessStream, cssStream)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(appAdminFolder))
        .pipe(rename('app.min.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest(appAdminFolder))
        .on('error', gutil.log);

    return mergedStream;
});

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('angular-ntk-dashboard.js'))
        .pipe(gulp.dest(appAdminFolder))
        .pipe(rename('angular-ntk-dashboard.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(appAdminFolder))
        .on('error', gutil.log);
});

gulp.task('scripts-vendor', function() {
    return gulp.src(jsVendorFiles)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(appAdminFolder))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(appAdminFolder))
        .on('error', gutil.log);
});

gulp.task('default', ['style', 'scripts', 'scripts-vendor']);
gulp.task('watch', ['default'], function() {
    gulp.watch(jsFiles, ['scripts']).on('error', gutil.log);
    gulp.watch(jsVendorFiles, ['scripts-vendor']).on('error', gutil.log);
    gulp.watch([
        appAdminFolder + '/**/*.less',
        appAdminFolder + '/**/*.css',
        '!' + appAdminFolder + '/app.css',
        '!' + appAdminFolder + '/app.min.css',
    ], ['style']).on('error', gutil.log);
});
