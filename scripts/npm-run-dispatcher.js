#!/usr/bin/env node

var devInstall = require("./dev-install");
var sass = require("./sass-transpiler");
var copier = require("./buildfilemanager");
var parser = require("./cl-parser").parser;


var args = parser.parseArgs(process.argv.slice(2));


if (args.command == "dev-install") {
  clean();
}

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
  sass.processSCSSFiles();
}

function build() {
  sass.processSCSSFiles();
  copier.copySrcsToTargets();
  sass.processHtmlInline();
}

function clean() {
  copier.clean();
  sass.clean();
}
