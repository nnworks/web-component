#!/usr/bin/env node

var Sass = require("./sass-transpiler");
var parser = require("./cl-parser").parser;
var cleaner = require("./clean");


var args = parser.parseArgs(process.argv.slice(2));

console.dir(args);


if (args.command == "preprocess") {
  console.log(Sass.sassInfo);

  Sass.processHtmlInline();
  Sass.processSCSSFiles();
}

if (args.command == "clean") {
  cleaner.clean();
}






