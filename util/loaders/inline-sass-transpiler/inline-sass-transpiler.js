"use strict";

const sass = require("node-sass");
const cheerio = require("cheerio");
const loaderUtils = require("loader-utils");
const jsonValidator = require("../../json-validator");

const SCSS_STYLE_ELM = "style[lang=\"scss\"]";

const optionsSchema = {
  $schema: "http://json-schema.org/draft-06/schema#",
  title: "Options checking schema",
  type: "object",
  required: ["scssBasePaths"],
  properties: {
    scssBasePaths: {
      description: "base path for imports in scss files",
      type: "array",
      items: {
        type: "string",
      }
    }
  }
};


function InlineSassTranspiler(content, map, meta) {

  const options = loaderUtils.getOptions(this) || {};
  jsonValidator.validate(options, optionsSchema, "inline-sass-transpiler").throwOnError();

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

// expose schema
InlineSassTranspiler.optionsSchema = optionsSchema;
module.exports = InlineSassTranspiler;