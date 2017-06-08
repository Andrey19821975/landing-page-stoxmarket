var gulp=require('gulp');
var sass=require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var csso = require('gulp-csso');
var rename  = require('gulp-rename'); 
var uglify = require('gulp-uglify');
var del  = require('del'); 
var concat = require('gulp-concat');
 

//development

gulp.task('sasss',function() {
	gulp.src('app/css/sass/*.sass')
	.pipe(sass().on('error',sass.logError))
	.pipe(gulp.dest('app/css'))
    

});


gulp.task('browser-sync', function() { 
    browserSync({ 
        server: { 
            baseDir: 'app' // directory for the server - app
        },
        notify: false // disable notifications
    });
});


gulp.task('sasss:watch',['sasss'],function() {
	gulp.watch('app/css/sass/*.sass',['sasss']);
    

}); 


gulp.task('sass', function(){ 
    return gulp.src('app/css/sass/**/*.sass') 
        .pipe(sass().on('error',sass.logError)) 
        .pipe(gulp.dest('app/css')) 
        .pipe(browserSync.reload({stream: true})) 
});


gulp.task('watch', ['browser-sync', 'sass'], function() {
    gulp.watch('app/css/sass/**/*.sass', ['sass']);
    gulp.watch('app/*.html', browserSync.reload); 
    gulp.watch('app/js/**/*.js', browserSync.reload);

	 
   
});

//finalize



gulp.task('scripts', function() {  //обьединение js файлов, пример 
  return gulp.src('./lib/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', function () {  //minif. js
    gulp.src('app/libs/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('clean', function() {
    return del.sync('dist'); 
});




gulp.task('finalize',['clean'],function() {
    gulp.src('app/css/*.css')
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(csso())            //Minification 
    .pipe(rename({suffix: '.min'})) // Add .min      
    .pipe(gulp.dest('./dist/css'));
    gulp.src('app/*.html')      //copy index.html
    .pipe(gulp.dest('dist'));
    gulp.src('app/fonts/**/*') // copy fonts
    .pipe(gulp.dest('dist/fonts'));
    gulp.src('app/js/**/*') // copy scripts
    .pipe(gulp.dest('dist/js'))
    gulp.src('app/libs/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/libs'));
    gulp.src('app/img/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/img'));

});