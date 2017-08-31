var fs = require("fs");
var path = require("path");
var sass = require("node-sass");
var walker = require("walker");
var cheerio = require("cheerio");
var fileUtils = require("./fileutils");

var config = require("../config/buildconfig.json");

var PROCESSINLINE_FILEEXTENSION = ".html";
var SCSS_FILEEXTENSION = ".scss";
var CSS_FILEEXTENSION = ".css";
var SCSS_STYLE_ELM = "style[lang='scss']";


var processHtmlInline = function () {
  var base = config.sass.inline.source.base;
  var files = fileUtils.getFiles(base, config.sass.inline.source.glob);
  files.forEach(function(file, index) {
    if (path.extname(file.fileName) == PROCESSINLINE_FILEEXTENSION) {
      processInlineInFile(base, file.fileName, config.sass.inline.target, file.stat);
    }
  });
};

var processSCSSFiles = function () {
  var base = config.sass.scss.source.base;
  var files = fileUtils.getFiles(base, config.sass.scss.source.glob);
  files.forEach(function(file, index) {
    if (path.extname(file.fileName) == SCSS_FILEEXTENSION) {
      processSCSS(config.sass.scss.source.base, file.fileName, config.sass.scss.target, file.stat);
    }
  });
};

/**
 * Process the inline scss tag in the given file
 * @param file
 * @param base
 * @param target
 * @param fileStat stat fo the source file, used for mode of the resulting file
 */
function processInlineInFile(base, file, target, fileStat) {
  var srcFile = path.join(base, file);
  var targetFile = path.join(target, file);

  if (fileUtils.isFileChanged(srcFile, targetFile)) {
    fs.readFile(srcFile, 'utf8', function (error, data) {
      var htmlDom = cheerio.load(data);
      var scssElements = htmlDom(SCSS_STYLE_ELM);

      if (scssElements) {
        scssElements.each(function(i, element) {
          var scss = htmlDom(element).html();
          if (scss) {
            compiledScss = sass.renderSync({
              data: scss.toString(),
              outputStyle: "compressed",
              includePaths: config.srcs,
            });

            htmlDom(element).text(compiledScss.css.toString()).removeAttr("lang");
          }
        });
      }

      fileUtils.writeFile(htmlDom.html(), this.outFile, this.fileStat);

    }.bind({outFile: path.join(target, file), fileStat: fileStat}));
  }
}

function processSCSS(base, file, target, fileStat) {
  var srcFile = path.join(base, file);
  var outFile = file.substr(0, file.lastIndexOf(".")) + CSS_FILEEXTENSION;
  var targetFile = path.join(target, outFile);

  if (fileUtils.isFileChanged(srcFile, targetFile)) {
    sass.render({
      file: path.join(base, file),
    }, function (error, result) {
      if (!error) {
        fileUtils.writeFile(result.css, this.outFile, this.fileStat);
      } else {
        console.log(error);
      }
    }.bind({outFile: targetFile, fileStat: fileStat}));
  }
}

function clean() {
  var removeFiles = [];

  // remove SCSS products
  var scssBase = config.sass.scss.source.base;
  var targetBase = config.sass.scss.target;
  var files = fileUtils.getFiles(scssBase, config.sass.scss.source.glob);
  files.forEach(function (file) {
    var targetFile = file.fileName.substr(0, file.fileName.lastIndexOf(".")) + CSS_FILEEXTENSION;
    removeFiles[removeFiles.length] = path.join(targetBase, targetFile);
  });

  // remove inline compile products
  var htmlBase = config.sass.inline.source.base;
  var targetBase = config.sass.inline.target;
  var files = fileUtils.getFiles(htmlBase, config.sass.inline.source.glob);
  files.forEach(function (file) {
    removeFiles[removeFiles.length] = path.join(targetBase, file.fileName);
  });

  fileUtils.removeList(removeFiles, true);
}

module.exports = {
  processHtmlInline: processHtmlInline,
  processSCSSFiles: processSCSSFiles,
  clean: clean,
  sassInfo: sass.info,
};
