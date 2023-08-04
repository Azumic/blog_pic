const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

gulp.task('minify-images', () => {
    return gulp.src('src/images/*.{jpg,png,gif}') // 指定要处理的图像文件的源路径
        .pipe(imagemin()) // 使用gulp-imagemin插件进行压缩
        .pipe(gulp.dest('dist/images')) // 指定压缩后的图像文件的目标路径
        .pipe(webp()) // 使用gulp-webp插件将图像转换为WebP格式
        .pipe(gulp.dest('dist/images')); // 指定转换后的WebP图像文件的目标路径
});

gulp.task('default', gulp.series('minify-images'));
