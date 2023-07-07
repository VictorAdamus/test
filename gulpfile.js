const {dest, src, series, parallel, watch} = require('gulp');
const plumber = require('gulp-plumber');
const sync  = require('browser-sync');
const postcss  = require('gulp-postcss');
const csso  = require('postcss-csso');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer  = require('autoprefixer');
const htmlmin  = require('gulp-htmlmin');
const rename = require('gulp-rename');
const clean = require('gulp-clean');

// styles

const styles = () => {
	return src('source/scss/style.scss', {sourcemaps: true})

	.pipe(plumber()) // обработка ошибок
	.pipe(sass())		//преобразовывает .scss в .css
	.pipe(postcss([  
		autoprefixer(),  //добавляем префиксы для кроссбр
		csso()  //минифицируем
	]))
	.pipe(rename('style.min.css'))
	.pipe(dest('build/css', {sourcemaps: '.'})) // перемещает файл (смотрим в браузере стили в формате scss)
	.pipe(sync.stream())
}

//clean

const cleanBuild = () => {
	return src('build') 
	.pipe(clean()) // удаляем папку build
}

//html 

const html = () => {
	return src('source/index.html')

	.pipe(htmlmin({collapseWhitespace: true})) //минифицируем html
	.pipe(dest('build'))
	.pipe(sync.stream())
}

const server = (done) => {
	sync.init({
		server: {
			baseDir: 'build'
		},
		cors: true,
		notify: false,
		ui: false,
	});
	done()
}

const reload = (done) => {
	sync.reload();
	done();
}

const watcher = () => {
	watch('source/scss/**/*.scss', styles);
	// watch('source/js/script.js', scripts)
	watch('source/index.html', series(html, reload));
}

exports.default = series(cleanBuild, parallel(styles, html), series(server, watcher));