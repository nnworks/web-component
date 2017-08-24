var fs = require("fs");
var path = require("path");
var sass = require("node-sass");
var walker = require("walker");
var cheerio = require("cheerio");
var fileUtils = require("./fileutils");
var cleaner = require("./cleaner");

var config = require("../config/buildconfig.json");

var PROCESSINLINE_FILEEXTENSION = ".html";
var SCSS_FILEEXTENSION = ".scss";
var CSS_FILEEXTENSION = ".css";
var SCSS_STYLE_ELM = "style[lang='scss']";


var processHtmlInline = function () {
  var base = config.sass.inline.source.base;
  var files = fileUtils.getSrcFiles(base, config.sass.inline.source.glob);
  files.forEach(function(file, index) {
    if (path.extname(file.fileName) == PROCESSINLINE_FILEEXTENSION) {
      processInlineInFile(file.fileName, base, config.sass.inline.target, file.stat);
    }
  });
};

var processSCSSFiles = function () {
  var base = config.sass.scss.source.base;
  var files = fileUtils.getSrcFiles(base, config.sass.scss.source.glob);
  files.forEach(function(file, index) {
    if (path.extname(file.fileName) == SCSS_FILEEXTENSION) {
      processSCSS(file.fileName, config.sass.scss.source.base, config.sass.scss.target, file.stat);
    }
  });
};

function processInlineInFile(file, src, target, fileStat) {
  console.log("processing: " + file + " and write result into " + path.join(target, file));

  fs.readFile(path.join(src, file), 'utf8', function (error, data) {
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

    writeFile(this.outFile, this.fileStat, htmlDom.html());

  }.bind({outFile: path.join(target, file), fileStat: fileStat}));
}

function processSCSS(file, src, target, fileStat) {
  var targetFile = file.substr(0, file.lastIndexOf(".")) + CSS_FILEEXTENSION;
  var outFile = path.join(target, targetFile);

  console.log("processing: " + file + " and write result into " + outFile);

  sass.render({
    file: path.join(src, file),
    //outFile: outFile,
  }, function (error, result) {
    if (!error) {
      writeFile(this.outFile, this.fileStat, result.css);
    } else {
      console.log(error);
    }
  }.bind({outFile: outFile, fileStat: fileStat}));
}

function writeFile(outFile, fileStat, data) {
  fileUtils.createPath(path.dirname(outFile));
  fs.writeFile(outFile, data, {mode: fileStat.mode});
}

function clean() {
  // SCSS products
  var scssBase = config.sass.scss.source.base;
  var targetBase = config.sass.scss.target;
  var files = fileUtils.getSrcFiles(scssBase, config.sass.scss.source.glob);
  var removeFiles = [];
  files.forEach(function(file, index) {
    var targetFile = file.fileName.substr(0, file.fileName.lastIndexOf(".")) + CSS_FILEEXTENSION;
    removeFiles[index] = path.join(targetBase, targetFile);
  });

  cleaner.clean(removeFiles);

  // Inline files will not be removed, they are part of the build folder which should be completely removed

}

module.exports = {
  processHtmlInline: processHtmlInline,
  processSCSSFiles: processSCSSFiles,
  clean: clean,
  sassInfo: sass.info,
};

