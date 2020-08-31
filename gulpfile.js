let gulp = require('gulp'), // Ну это понятно
    browserSync = require('browser-sync'), // BrowserSync
    sass = require('gulp-sass'), // Это SASS
    autoprefixer = require('gulp-autoprefixer'), // Добавление префиксов
    rename = require('gulp-rename'), // Ренейминг (переименование) файлов
    uglify = require('gulp-uglify'), // Минификация JS файлов
    concat = require('gulp-concat'), // Конкатинация файлов
    del = require('del'), // Удаление чего-либо
    htmlmin = require('gulp-htmlmin'), // Минификация HTML файлов
    purgecss = require('gulp-purgecss'); // Удаление не использущихся стилей



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
  .pipe(browserSync.reload({ // Само подключение BrowserSync
    stream: true
  }))
});
// Функция подключения BrowserSync к JS файлам
gulp.task('js', function(){
  return gulp.src('app/js/*.js') // Хде эти файлы
  .pipe(browserSync.reload({ // Подключение BrowserSync
    stream: true
  }))
});


// Функция компиляции SCSS в CSS
gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss') // Откуда брать SCSS
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ // Автопрефиксер
      overrideBrowserslist: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
      cascade: false
    }))
    .pipe(purgecss({ // Функция purgecss, который убирает неиспользующиеся CSS стили
      content: ['app/views/**/*.html'], // HTML файл, откуда ему смотреть классы
      whitelistPatterns: [ /slick-.*$/ ] // Игнорирование либы Slick-slider
    }))
    .pipe(gulp.dest('app/css')) // Куда суем скомпилированные файлы
    .pipe(browserSync.reload({ // Подключение BrowserSync для CSS
      stream: true
    }))
});
// Тут будет функция компиляции PUG файлов


// Функция конкатинации библиотек JS
gulp.task('js-concat', function(){
  return gulp.src([ // Откуда берем файлы для конкатинации
    'node_modules/slick-carousel/slick/slick.js'
  ])
    .pipe(concat('libs.min.js')) // В какой файл складываем сконкатинированные библиотеки
    .pipe(uglify()) // Минификация
    .pipe(gulp.dest('app/js')) // Куды этот файл суем
    .pipe(browserSync.reload({
      stream: true // Подключение BrowserSync
    }))
});


// Функция удаления папки dist
gulp.task('del', async function(){
  del.sync('dist')
})
// Экспортирование проекта в папку dist
gulp.task('export', async function(){
  let buildHtml = gulp.src('app/views/**/*.html') // Экспортирование HTML файлов
    .pipe(htmlmin({ // Минификация HTML файлов
      collapseWhitespace: true, // Удаляем все переносы
      removeComments: true // Удаляем все комментарии
    }))
    .pipe(gulp.dest('dist/views'));

  let BuildCss = gulp.src('app/css/**/*.css') // Экспортирование CSS файлов
    .pipe(sass({
      outputStyle: 'compressed' // Сжатие CSS файла
    }))
    .pipe(rename({
      suffix: '.min' // Добавление суффикса ".min" для сжатого CSS файла
    }))
    .pipe(gulp.dest('dist/css')); // Куда

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
gulp.task('default', gulp.parallel('sass', 'js-concat', 'browser-sync', 'watch'));

// Функция билдинга проекта в папку dist
gulp.task('build', gulp.series('del', 'export'))