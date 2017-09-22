let fs = require("fs");
let path = require("path");
let sass = require("node-sass");
let walker = require("walker");
let cheerio = require("cheerio");
let fileUtils = require("./fileutils");

let config = require("../config/buildconfig.json");

const PROCESSINLINE_FILEEXTENSION = ".html";
const SCSS_FILEEXTENSION = ".scss";
const CSS_FILEEXTENSION = ".css";
const SCSS_STYLE_ELM = "style[lang='scss']";


function processHtmlInline() {
  let base = config.sass.inline.source.base;
  let files = fileUtils.getFiles(base, config.sass.inline.source.glob);
  files.forEach(function(file) {
    if (path.extname(file.fileName) === PROCESSINLINE_FILEEXTENSION) {
      processInlineInFile(base, file.fileName, config.sass.inline.target, file.stat, false);
    }
  });
};

function processSCSSFiles() {
  let base = config.sass.scss.source.base;
  let files = fileUtils.getFiles(base, config.sass.scss.source.glob);
  files.forEach(function(file) {
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
function processInlineInFile(base, file, target, fileStat, checkchanged = true) {
  let srcFile = path.join(base, file);
  let targetFile = path.join(target, file);

  if (!checkchanged || fileUtils.isFileChanged(srcFile, targetFile)) {
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
  let srcFile = path.join(base, file);
  let outFile = file.substr(0, file.lastIndexOf(".")) + CSS_FILEEXTENSION;
  let targetFile = path.join(target, outFile);

  if (fileUtils.isFileChanged(srcFile, targetFile)) {
    sass.render({
      file: path.join(base, file),
    }, function (error, result) {
      if (!error) {
        fileUtils.writeFile(result.css, this.outFile, this.fileStat, true);
      } else {
        console.log(error);
      }
    }.bind({outFile: targetFile, fileStat: fileStat}));
  }
}

function clean() {
  let removeFiles = [];

  // remove SCSS products
  let scssBase = config.sass.scss.source.base;
  let targetBase = config.sass.scss.target;
  let files = fileUtils.getFiles(scssBase, config.sass.scss.source.glob);
  files.forEach(function (file) {
    var targetFile = file.fileName.substr(0, file.fileName.lastIndexOf(".")) + CSS_FILEEXTENSION;
    removeFiles[removeFiles.length] = path.join(targetBase, targetFile);
  });

  // remove inline compile products
  let htmlBase = config.sass.inline.source.base;
  let targetBase = config.sass.inline.target;
  let files = fileUtils.getFiles(htmlBase, config.sass.inline.source.glob);
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
