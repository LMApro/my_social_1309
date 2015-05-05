var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var sourcemaps = require('gulp-sourcemaps');

gulp.task('minify-js', function(){
	gulp.src([
		'public/javascripts/angularApp.js',
		'public/javascripts/auth/*.js',
		'public/javascripts/config/*.js',
		'public/javascripts/helper/*.js',
		'public/javascripts/home/*.js',
		'public/javascripts/post/*.js',
		'public/javascripts/user/*.js',
		])
	.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(uglify())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./public/javascripts'));
	
	gulp.src([
		'public/javascripts/vendor/angular.min.js',
		'public/javascripts/vendor/angular-ui-router.min.js',
		'public/javascripts/vendor/dirPaginate.min.js',
		'public/javascripts/vendor/ui-bootstrap-0.12.1.min.js',
		])
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('./public/javascripts'));
});