'use strict';

import gulp from 'gulp';
import del from 'del';
import babel from 'gulp-babel';
import yargs from 'yargs';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import eslint from 'gulp-eslint';
import sass from 'gulp-sass';
import bs from 'browser-sync';

const isDev = !!(yargs.argv.dev); // gulp --dev

// Paths
const Path = {
	DIST: 'dist',
	SRC: 'src',
	Select: {
		CSS_DEV: 'src/styles/*.css',
		JS_DEV: 'src/js/*.js',
		JS: 'src/js/es6/*.js',
		JS_VENDOR: 'src/js/vendors/*.js',
		SASS: 'src/styles/scss/*.scss',
		IMGS: 'src/img/**/*'
	}
};


// Clean up
gulp.task('clean', del.bind(null, [
	Path.DIST,
	Path.Select.CSS_DEV,
	Path.Select.JS_DEV
]));


/* JS Tasks ======================================== */

gulp.task('lint', () => {
	return gulp.src(Path.Select.JS)
		.pipe(eslint({
			configFile: './.eslintrc'
		}))
    .pipe(eslint.failOnError());
});

// PROD: js process
gulp.task('js-prod', ['lint'], () => {
	return gulp.src(Path.Select.JS)
		.pipe(babel())
    .pipe(uglify())
		.pipe(gulp.dest(Path.DIST + '/js'));
});

gulp.task('js', ['lint'], () => {
	return gulp.src(Path.Select.JS)
		.pipe(sourcemaps.init())
		.pipe(babel())
    .pipe(sourcemaps.write())
		.pipe(gulp.dest(Path.SRC + '/js'))
		.pipe(bs.reload({stream: true}));
});


/* Styles Tasks =================================== */

// Sass compilation
gulp.task('sass-prod', () => {
	return gulp.src(Path.Select.SASS)
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(gulp.dest(Path.DIST + '/styles'));
});

gulp.task('sass', () => {
	return gulp.src(Path.Select.SASS)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(Path.SRC + '/styles'))
		.pipe(bs.reload({stream: true}));
});


/* Other Tasks =================================== */

// PROD: Move assets
gulp.task('build', ['js-prod', 'sass-prod'], () => {
	let srcFiles = [
		Path.SRC + '/*.html',
		Path.Select.JS_VENDOR,
		Path.Select.IMGS
	];
  return gulp.src(srcFiles, {base: './' + Path.SRC})
  	.pipe(gulp.dest(Path.DIST));
});

gulp.task('browser-sync', ['sass', 'js'], () => {
    bs.init({
        server: {
            baseDir: ['src'],
        },
        port: 3000,
        open: true,
        ui: {
            port: 3001
        }
    });
});

gulp.task('watch', ['browser-sync'], () => {
		let filesChange = [
			Path.SRC + '/*.html',
			Path.Select.JS_VENDOR,
			Path.Select.IMGS
		];
		gulp.watch(Path.Select.SASS, ['sass']);
		gulp.watch(Path.Select.JS, ['js']);
    gulp.watch(filesChange).on('change', bs.reload);
});


/* INITIATOR Tasks ================================ */

// Init dev
gulp.task('dev', ['watch'], () => {});

// Main GULP Task
gulp.task('default', ['clean'], () => {
	return isDev ? gulp.start('dev') : gulp.start('build');
});
