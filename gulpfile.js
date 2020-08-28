let gulp = require('gulp'), // Ну это понятно
    sass = require('gulp-sass'), // Это SASS
    browserSync = require('browser-sync'), // BrowserSync
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Конкатинация
    rename = require('gulp-rename'), // Ренейминг файлов
    del = require('del'), // Удаление чего-либо
    autoprefixer = require('gulp-autoprefixer'), // Добавление префиксов
    htmlmin = require('gulp-htmlmin'),
    purgecss = require('gulp-purgecss');



gulp.task('browser-sync', function() { // Функция подключения BrowserSync
  browserSync.init({ // Я хуй знает, что это, но, по-моему, настройки этого дерьма
      server: {
          baseDir: ["app/", "app/views"] // Директория работы этой хуйни
      },
      notify: false
  });
});

// Функция подключения BrowserSync к HTML файлам
gulp.task('html', function(){
  return gulp.src('app/views/**/*.html') // Хде эти файлы
  .pipe(browserSync.reload({stream: true})) // Само подключение BrowserSync
});

// Функция подключения BrowserSync к JS файлам
gulp.task('js', function(){
  return gulp.src('app/js/*.js') // Хде эти файлы
  .pipe(browserSync.reload({stream: true})) // Само подключение BrowserSync
});


// Функция компилинга SCSS в CSS
gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss') // Откуда брать SCSS
    .pipe(sass().on('error', sass.logError))
    .pipe(purgecss({
      content: ['app/views/**/*.html'],
      whitelistPatterns: [ /slick-.*$/ ]
    }))
    .pipe(sass({outputStyle: 'compressed'})) // Сжатие CSS файла//
    .pipe(autoprefixer({ // Автопрефиксер
      overrideBrowserslist: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
      cascade: false
    }))
    .pipe(rename({suffix: '.min'})) // Добавление суффикса ".min" для сжатого CSS файла
    .pipe(gulp.dest('app/css')) // Куда суем скомпилированные файлы
    .pipe(browserSync.reload({stream: true})) // Подключение BrowserSync для CSS
});


// Функция конкатинации библиотек CSS
gulp.task('css-concat', function(){
  return gulp.src([ // Откуда берем файлы для конкатинации
    'node_modules/normalize.css/normalize.css',
    'node_modules/slick-carousel/slick/slick.css'
  ])
    .pipe(concat('_libs.scss')) // В какой файл складываем сконкатинированные библиотеки
    .pipe(gulp.dest('app/scss')) // Куды этот файл суем
    .pipe(browserSync.reload({stream: true})) // Подключение BrowserSync
});

// Функция конкатинации библиотек JS
gulp.task('js-concat', function(){
  return gulp.src([ // Откуда берем файлы для конкатинации
    'node_modules/slick-carousel/slick/slick.js'
  ])
    .pipe(concat('libs.min.js')) // В какой файл складываем сконкатинированные библиотеки
    .pipe(uglify())
    .pipe(gulp.dest('app/js')) // Куды этот файл суем
    .pipe(browserSync.reload({stream: true})) // Подключение BrowserSync
});


// Функция удаления папки dist
gulp.task('clean', async function(){
  del.sync('dist')
})

// Экспортирование проекта в папку dist
gulp.task('export', async function(){
  let buildHtml = gulp.src('app/views/**/*.html') // Экспортирование HTML файлов
    .pipe(htmlmin({ // Минификация HTML файлов
      collapseWhitespace: true, // удаляем все переносы
      removeComments: true // удаляем все комментарии
    }))
    .pipe(gulp.dest('dist/views'));

  let BuildCss = gulp.src('app/css/**/*.css') // Экспортирование CSS файлов
    
    .pipe(gulp.dest('dist/css'))
    .pipe(gulp.dest('dist/css'));

  let BuildJs = gulp.src('app/js/**/*.js') // Экспортирование JS файлов
    .pipe(gulp.dest('dist/js'));

  let BuildFonts = gulp.src('app/fonts/**/*.*') // Экспортирование шрифтов
    .pipe(gulp.dest('dist/fonts'));

  let BuildImg = gulp.src('app/img/**/*.*') // Экспортирование картинок
    .pipe(gulp.dest('dist/img'));
});


// Функция Watch для слежения за изменениями файла
gulp.task('watch', function(){
  gulp.watch('app/scss/**/*.scss', gulp.parallel('sass')); // Слежение за SCSS файлами
  gulp.watch('app/views/**/*.html', gulp.parallel('html')) // Слежение за HTML файлами
  gulp.watch('app/js/*.js', gulp.parallel('js')) // Слежение за JS файлами
});


// Запуск рабочего процесса GULP командой "gulp". Выполняются все указанные функции, и проект робит)
gulp.task('default', gulp.parallel('sass', 'css-concat', 'js-concat', 'browser-sync', 'watch'));

// Функция билдинга проекта в папку dist
gulp.task('build', gulp.series('clean', 'export'))