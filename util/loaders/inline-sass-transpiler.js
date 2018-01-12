"use strict";

let sass = require("node-sass");
let cheerio = require("cheerio");
let loaderUtils = require("loader-utils");
let validateOptions = require("schema-utils");

const SCSS_STYLE_ELM = "style[lang=\"scss\"]";

const schema = {
  $schema: "http://json-schema.org/draft-06/schema#",
  title: "Options checking schema",
  type: "object",
  required: ["scssBasePaths"],
  properties: {
    scssBasePath: {
      description: "base path for imports in scss files",
      type: "array",
      items: {
        type: "string",
      }
    }
  }
};


function inlineSassTranspiler(content, map, meta) {

  const options = loaderUtils.getOptions(this) || {};
  validateOptions(schema, options, "InlineSassTranspilerLoader");

  // loop all scss source paths for interpolation
  const interpolatedScssPaths = [];
  for (var index in options.scssBasePaths) {
    interpolatedScssPaths.push(loaderUtils.interpolateName(this, options.scssBasePaths[index], (options != null)?options:{}));
  }

  var htmlDom = cheerio.load(content, {normalizeWhitespace: false, xmlMode: true});
  var scssElements = htmlDom(SCSS_STYLE_ELM);

  if (scssElements) {
    scssElements.each(function(i, element) {
      var scss = htmlDom(element).html();
      if (scss) {
        let compiledScss = sass.renderSync({
          data: scss.toString(),
          outputStyle: "compressed",
          includePaths: interpolatedScssPaths,
        });

        htmlDom(element).text(compiledScss.css.toString()).removeAttr("lang");
      }
    });
  }

  return htmlDom.html();
}

module.exports = inlineSassTranspiler;