#!/usr/bin/env node

var Sass = require("./sass-transpiler");
var parser = require("./cl-parser").parser;


var args = parser.parseArgs(process.argv.slice(2));

console.dir(args);


if (args.command == "preprocess") {
  preProcess();
}

if (args.command == "build") {
  build();
}

if (args.command == "clean") {
  clean();
}


function preProcess() {
  Sass.processSCSSFiles();
}

function build() {
  Sass.processSCSSFiles();
  Sass.processHtmlInline();
}

function clean() {
  Sass.clean();
}
