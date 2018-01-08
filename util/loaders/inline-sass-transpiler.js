"use strict";

let sass = require("node-sass");
let cheerio = require("cheerio");
let loaderUtils = require("loader-utils");
let validateOptions = require('schema-utils');

// import * as sass from "node-sass";
// import * as cheerio from "cheerio";

// import { getOptions } from 'loader-utils';
// import { validateOptions } from 'schema-utils';

const SCSS_STYLE_ELM = "style[lang='scss']";

const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string'
    }
  }
}


function inlineSassTranspiler(content, map, meta) {

  const options = loaderUtils.getOptions(this);
  console.log(options);
  // loop all scss source paths for interpolation
  const interpolatedScssPaths = [];
  for (var index in options.scssPath) {
    interpolatedScssPaths.push(loaderUtils.interpolateName(this, options.scssPath[index], (options != null)?options:{}));
  }

  console.log(interpolatedScssPaths);

  //validateOptions

  console.log(content);


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

  console.log(htmlDom.html());
  return htmlDom.html();
}

module.exports = inlineSassTranspiler;