"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var pug = require('gulp-pug');
var gulp = require("gulp");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var cssmin = require('gulp-minify-css');
var gulp = require("gulp");
var imagemin = require("gulp-imagemin");
var del = require("del");
var run = require('gulp-sequence');

gulp.task("clean", function() {
  return del("build");
});

gulp.task("copy", function() {
  return gulp.src([
      "fonts/**/*.{woff,woff2}",
      "img/**",
      "js/**",
      "*.html"
], {
base: "." })
    .pipe(gulp.dest("build"));
});


gulp.task("images", function() {
  return gulp.src("img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
]))
    .pipe(gulp.dest("build/img"));
});

gulp.task('pug', function buildHTML() {
  gulp.src('source/pug/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest(""));
});

gulp.task("symbols", function() {
  return gulp.src("build/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions"
      ]})
    ]))
    .pipe(cssmin())
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
});

gulp.task("build", function(fn) {
  run ("clean","pug","images","copy","symbols","style",fn);
});

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html").on("change", server.reload);

