var fs = require("fs");
var path = require("path");
var config = require("../config/buildconfig.json");
var sass = require("node-sass");
var Walker = require("walker");

var PROCESSINLINE_FILEEXTENSION = ".html";
var SCSS_FILEEXTENSION = ".scss";
var CSS_FILEEXTENSION = ".css";

var processHtmlInline = function () {
  config.srcs.forEach(function (srcPath, i) {
    Walker(srcPath)
      .filterDir(function (dir, stat) {
        return true;
      }).on('file', function (file, stat) {
      if (path.extname(file) == PROCESSINLINE_FILEEXTENSION) {
        processInlineInFile(path.relative(srcPath, file), srcPath, config.targets[i], stat);
      }
    });
  });
};

var processSCSSFiles = function () {
  config.srcs.forEach(function (srcPath, i) {
    Walker(srcPath)
      .filterDir(function (dir, stat) {
        return true;
      }).on('file', function (file, stat) {
      if (path.extname(file) == SCSS_FILEEXTENSION) {
        processSCSS(path.relative(srcPath, file), srcPath, config.targets[i], stat);
      }
    })
  });
};

function processInlineInFile(file, src, target, fileStat) {
  console.log("processing: " + file + " and write result into " + path.join(target, file));
}

function processSCSS(file, src, target, fileStat) {
  var targetFile = file.substr(0, file.lastIndexOf(".")) + CSS_FILEEXTENSION;
  var outFile = path.join(target, targetFile);

  console.log("processing: " + file + " and write result into " + outFile);

  sass.render({
    file: path.join(src, file),
    outFile: outFile,
  }, function (error, result) {
    if (!error) {
      if (!fs.existsSync(path.dirname(outFile))) {
        fs.mkdirSync(path.dirname(outFile));
      }
      fs.writeFile(outFile, result.css, {mode: fileStat.mode});
    } else {
      console.log(error);
    }
  });
}

module.exports = {
  processHtmlInline: processHtmlInline,
  processSCSSFiles: processSCSSFiles,
  sassInfo: sass.info,
};

