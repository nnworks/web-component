"use strict";

let cheerio = require("cheerio");
let loaderUtils = require("loader-utils");
let validateOptions = require("schema-utils");

const CSS_STYLE_LINK_ELM = "link[rel=\"stylesheet\"]";

const schema = {
  $schema: "http://json-schema.org/draft-06/schema#",
  title: "Options checking schema",
  type: "object",
  required: ["cssBundlePath"],
  properties: {
    cssBundlePath: {
      description: "bundled style file name",
      type: "string",
    },
  }
};

/**
 * Bundles style files (css & scss) to replace the currently linked one.
 * @param content content of the html file
 * @param map
 * @param meta
 * @returns the changed html
 */
function linkedStyleBundlerLoader(content, map, meta) {

  this.cacheable();

  const options = loaderUtils.getOptions(this) || {};
  validateOptions(schema, options, "linked-style-bundler-loader");

  // parse html in xml mode to leave all as is
  var htmlDom = cheerio.load(content, {normalizeWhitespace: false, xmlMode: true});
  var cssLinkElements = htmlDom(CSS_STYLE_LINK_ELM);

  if (cssLinkElements) {
    var elementReplaced = false;
    cssLinkElements.each(function(i, element) {
      var cssHref = htmlDom(element).attr("href");
      if (cssHref) {
        // add  require for css
        htmlDom(element).after("\n<script> require(\"" + cssHref + "\"); </script>");

        if(!elementReplaced) {
          // replace href attribute
          htmlDom(element).attr("href", options.cssBundlePath);
          elementReplaced = true;
        } else {
          // remove complete tag
          htmlDom(element).replaceWith("<!-- " + cssHref + " -->");
        }
      }
    });
  }

  return htmlDom.html();
}

module.exports = linkedStyleBundlerLoader;