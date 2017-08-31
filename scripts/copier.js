var fileUtils = require("./fileutils");
var path = require("path");

var config = require("../config/buildconfig.json");


function copySrcsToTargets() {
  config.srcs.forEach(function(src, index) {
    var base = src[0];
    var glob = src[1];
    var target = config.targets[index];
    var files = fileUtils.getFiles(base, glob);

    fileUtils.copyFiles(base, files, target, false);
  });
}

function clean() {
  config.srcs.forEach(function (src, index) {
    var base = src[0];
    var glob = src[1];
    var target = config.targets[index];
    var files = fileUtils.getFiles(base, glob);
    var fullPathFiles = [];

    files.forEach(function(file) {
      fullPathFiles[fullPathFiles.length] = path.join(target, file.fileName);
    });

    fileUtils.removeList(fullPathFiles, true);
  });
}

module.exports = {
  copySrcsToTargets: copySrcsToTargets,
  clean: clean
}