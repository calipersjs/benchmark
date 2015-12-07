'use strict';

// NOTE: To run these benchmarks, make sure you have ImageMagick installed.
// ImageMagick is used as a comparison for measuring PNG and JPEG files.

var fs       = require('fs');
var path     = require('path');
var Promise  = require('bluebird');
var pexec    = Promise.promisify(require('child_process').exec);

var calipers = require('calipers')('png', 'jpeg', 'pdf', 'gif', 'bmp');

var ITERATIONS  = 500;
var CONCURRENCY =  50;

var PDF_PATH  = path.resolve(__dirname, 'images/123x456.1.pdf');
var PNG_PATH  = path.resolve(__dirname, 'images/123x456.png');
var JPEG_PATH = path.resolve(__dirname, 'images/123x456.jpg');
var GIF_PATH  = path.resolve(__dirname, 'images/245x260.gif');
var BMP_PATH  = path.resolve(__dirname, 'images/233x143.bmp');

function runCalipersBenchmark (name, file) {
  var arr = new Array(ITERATIONS);
  console.time(name);
  return Promise.resolve(arr)
  .map(function () {
    return calipers.measure(file);
  }, { concurrency: CONCURRENCY })
  .then(function () {
    console.timeEnd(name);
  });
}

function runExecBenchmark (name, command, file) {
  var arr = new Array(ITERATIONS);
  console.time(name);
  return Promise.resolve(arr)
  .map(function () {
    return pexec(command + ' ' + file);
  }, { concurrency: CONCURRENCY })
  .then(function () {
    console.timeEnd(name);
  })
}

console.log('Running benchmarks with ' + ITERATIONS +
  ' iterations at concurrency: ' + CONCURRENCY + '.\n');

runCalipersBenchmark('PDF calipers', PDF_PATH)
.then(function () {
  return runExecBenchmark('PDF pdfinfo', 'pdfinfo', PDF_PATH);
})
.then(function() {
  return runCalipersBenchmark('PNG calipers', PNG_PATH);
})
.then(function () {
  return runExecBenchmark('PNG identify', 'identify', PNG_PATH);
})
.then(function () {
  return runCalipersBenchmark('JPEG calipers', JPEG_PATH);
})
.then(function () {
  return runExecBenchmark('JPEG identify', 'identify', JPEG_PATH);
})
.then(function () {
  return runCalipersBenchmark('GIF calipers', GIF_PATH);
})
.then(function () {
  return runExecBenchmark('GIF identify', 'identify', GIF_PATH);
})
.then(function () {
  return runCalipersBenchmark('BMP calipers', BMP_PATH);
})
.then(function () {
  return runExecBenchmark('BMP identify', 'identify', BMP_PATH);
});
