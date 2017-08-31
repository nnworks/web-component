var nodeGlob = require("glob");
var fs = require("fs");
var path = require("path");

/**
 * Searches recursively for files in the base directory.
 * @param base directory to search in (recusively)
 * @param glob glob expression
 * @return array with {fileName: relative name, stat: stat of file} entries
 */
function getFiles(base, glob) {
  var files = resolveGlob(path.join(base, glob));
  // make files relative to base
  files.forEach(function(file, index) {
    file.fileName = path.relative(base, file.fileName);
  });

  return files;
}

/**
 * Copies set of files in base direcatory to target directory, and syncs timestamps
 * @param base directory containing the files
 * @param files all files ({fileName, stat}) to be copied with a path relative to the base directory
 * @param target directory where the files will be written
 * @param forceWrite write the target file even if the size and modified timestamp is the same
 */
function copyFiles(base, files, target, forceWrite = false) {
  files.forEach(function(file){
    var stat = file.stat;
    var fileName = file.fileName;
    var srcFile = path.join(base, fileName);
    var targetFile = path.join(target, fileName);

    if (forceWrite || isFileChanged(srcFile, targetFile)) {
      copyFile(srcFile, targetFile, true);
    }
  });
}

/**
 * Copy a file
 * @param srcFile
 * @param targetFile
 * @param syncTimeStamp sync atime and mtime for target file
 */
function copyFile(srcFile, targetFile, syncTimeStamp = false) {
  createPath(targetFile);

  var fIn = fs.openSync(srcFile, 'r');
  const stat = fs.fstatSync(fIn);
  const fOut = fs.openSync(targetFile, 'w', stat.mode)
  var read = 0;
  var pos = 0;
  const BUFFER_SIZE = 32768;
  var buffer = new Buffer(BUFFER_SIZE);


  do {
    read = fs.readSync(fIn, buffer, 0, BUFFER_SIZE, pos);
    if (read > 0) {
      fs.writeSync(fOut, buffer, 0, read);
      pos += read;
    }
  } while (read > 0);

  if (syncTimeStamp) {
    fs.futimesSync(fOut, stat.atime, stat.mtime);
  }

  fs.close(fIn);
  fs.close(fOut);
}

/**
 * Write the buffer to the target file
 * @param buffer
 * @param targetFile
 * @param mode file creation mode
 */
function writeFile(buffer, targetFile, stat, syncTime) {
  createPath(path.dirname(targetFile));
  fs.writeFile(targetFile, buffer, {mode: stat.mode});

  if (syncTime) {
    fs.utimesSync(targetFile, stat.atime.getTime(), stat.mtime.getTime());
  }
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
    if (fs.statSync(curPath).isDirectory()) { // recurse
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
      if (fs.statSync(targetPath).isDirectory()) {
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

/**
 * Has the files changed? (Or does the targetFile not exist?)
 * @param srcFile
 * @param targetFile
 * @returns boolean
 */
function isFileChanged(srcFile, targetFile) {
  if (!fs.existsSync(targetFile)) {
    return true;
  }

  var targetStat = fs.statSync(targetFile);
  var srcStat = fs.statSync(srcFile);

  return (targetStat.size != srcStat.size || targetStat.mtime.getTime() != srcStat.mtime.getTime());
}

module.exports = {
  getFiles: getFiles,
  copyFiles: copyFiles,
  copyFile: copyFile,
  writeFile: writeFile,
  createPath: createPath,
  removeList: removeList,
  isFileChanged: isFileChanged
}