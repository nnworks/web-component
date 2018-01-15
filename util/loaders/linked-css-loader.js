"use strict";

let cheerio = require("cheerio");
let loaderUtils = require("loader-utils");
let validateOptions = require("schema-utils");

const CSS_STYLE_LINK_ELM = "link[rel=\"stylesheet\"]";

const schema = {
  $schema: "http://json-schema.org/draft-06/schema#",
  title: "Options checking schema",
  type: "object",
  required: ["cssBundleName"],
  properties: {
    cssBundleName: {
      description: "bundles css file to replace the currently linked one",
      type: "string",
    }
  }
};


function replaceLinkedCssByBundle(content, map, meta) {

  this.cacheable();

  const options = loaderUtils.getOptions(this) || {};
  validateOptions(schema, options, "ReplaceLinkedCssByBundleLoader");

  // parse html
  var htmlDom = cheerio.load(content, {normalizeWhitespace: false, xmlMode: true});
  var cssLinkElements = htmlDom(CSS_STYLE_LINK_ELM);

  if (cssLinkElements) {
    cssLinkElements.each(function(i, element) {
      var cssHref = htmlDom(element).attr("href");
      if (cssHref) {
        htmlDom(element).attr("href", options.cssBundleName);
        console.log("replaced css link href [" + cssHref + "] with " + options.cssBundleName);
      }
    });
  }

  return htmlDom.html();
}

module.exports = replaceLinkedCssByBundle;