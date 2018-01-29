"use strict";
let loaderUtils = require("loader-utils");


function linkedCssBundlerLoader(content, map, meta) {

  this.cacheable();

  const options = loaderUtils.getOptions(this) || {};

  console.log("module " + this.resourcePath + " passes monitoring loader...");

  return content;
}

module.exports = linkedCssBundlerLoader;