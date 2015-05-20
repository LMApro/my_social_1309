var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var sourcemaps = require('gulp-sourcemaps');
var minifyHTML = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');

gulp.task('minify-dev-js', function(){
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
	.pipe(gulp.dest('./dist/javascripts'));
});

gulp.task('minify-vendor-js', function(){
	gulp.src([
		'public/javascripts/vendor/angular.min.js',
		'public/javascripts/vendor/angular-ui-router.min.js',
		'public/javascripts/vendor/dirPaginate.min.js',
		'public/javascripts/vendor/angular-pusher.min.js',
		'public/javascripts/vendor/ui-bootstrap-0.12.1.min.js',
		])
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('./dist/javascripts'));
});

gulp.task('minify-html', function() {
   var opts = {
   	conditionals: true,
   	quotes: true
   };

 	gulp.src('public/index.html')
 		.pipe(minifyHTML(opts))
 		.pipe(gulp.dest('./dist'));

   gulp.src('public/templates/*.html')
   	.pipe(minifyHTML(opts))
   	.pipe(gulp.dest('./dist/templates'));
});

gulp.task('minify-css', function() {
   return gulp.src([
   	'public/stylesheets/bootstrap.min.css',
   	'public/stylesheets/angular-csp.css',
   	'public/stylesheets/style.css'
   	])
   	.pipe(concat('styles.css'))
   	.pipe(minifyCss({compatibility: 'ie8'}))
   	.pipe(gulp.dest('./dist/stylesheets'));
});

gulp.task('build', ['minify-vendor-js', 'minify-dev-js', 'minify-html', 'minify-css']);



