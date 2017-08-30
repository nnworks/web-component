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

function removePathIfEmpty(pathToRemove) {
  var curPath = path.normalize(pathToRemove);
  while (true) {
    if (fs.existsSync(curPath)) {
      // is it empty?
      if (fs.readdirSync(curPath).length == 0) {
        fs.rmdirSync(curPath);
      }
    }


    if (curPath.lastIndexOf(path.sep) == -1) {
      break;
    }

    // strip last part of path curPath
    curPath = curPath.substr(0, curPath.lastIndexOf(path.sep));
  }
}

/**
 * Removes directory (after recursively removing its content)
 * @param dirPath directory to remove
 */
function emptyFolder(dirPath) {
  // empty folder recursively
  fs.readdirSync(dirPath).forEach(function (file) {
    var curPath = path.join(targetPath, file);
    if (fs.lstatSync(curPath).isDirectory()) { // recurse
      emptyFolder(curPath);
      fs.rmdirSync(curPath);
    } else {
      fs.unlinkSync(curPath);
    }
  });
}

/**
 * Removes all files / folders in targets array
 *
 * @param targets array with files / directories to remove
 * @param removeEmptyDirectories boolean: remove empty directories on the path (default: false)
 */
function removeList(targets, removeEmptyDirectories = false) {
  targets.forEach(function (targetPath) {
    if (fs.existsSync(targetPath)) {
      if (fs.lstatSync(targetPath).isDirectory()) {
        emptyFolder(targetPath);
      } else {
        fs.unlinkSync(targetPath);
      }
    }

    if (removeEmptyDirectories) {
      removePathIfEmpty(targetPath);
    }
  });

};


module.exports = {
  getSrcFiles: getSrcFiles,
  createPath: createPath,
  removeList: removeList
}