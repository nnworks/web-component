var nodeGlob = require("glob");
var fs = require("fs");
var path = require("path");

function getSrcFiles(base, glob) {
  var files = resolveGlob(path.join(base, glob));
  // make files relative to base
  files.forEach(function(file, index) {
    file.fileName = path.relative(base, file.fileName);
  });

  return files;
}

function resolveGlob(glob) {
  var founds = nodeGlob.sync(glob, {});
  var files = [];

  founds.forEach(function(file, index) {
    var stat = fs.statSync(file);
    files[index] = {"fileName": file, "stat": stat};
  });

  return files;
}

function createPath(filePath) {
  var dirs = filePath.split(path.sep);
  var buildDir = "";
  dirs.forEach(function(dir, index) {
    // not a file?
    if (dir.indexOf(".") == -1) {
      buildDir += ((buildDir.length > 0)?path.sep:"") + dir;
      if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir);
      }
    }
  });

}

module.exports = {
  getSrcFiles: getSrcFiles,
  createPath: createPath,
}