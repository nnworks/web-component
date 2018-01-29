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
    },
    pluginInstance: {
      description: "instance of the plugin that will trigger the css bundle genaration",
      type: "object",
    }
  }
};


function linkedCssBundlerLoader(content, map, meta) {

  this.cacheable();

  const options = loaderUtils.getOptions(this) || {};
  validateOptions(schema, options, "linkedCssBundlerLoader");

  // console.log(this.request);

  // parse html in xml mode to leave all as is
  var htmlDom = cheerio.load(content, {normalizeWhitespace: false, xmlMode: true});
  var cssLinkElements = htmlDom(CSS_STYLE_LINK_ELM);

  if (cssLinkElements) {
    var elementReplaced = false;
    cssLinkElements.each(function(i, element) {
      var cssHref = htmlDom(element).attr("href");
      if (cssHref) {
        if(!elementReplaced) {
          // replace href attribute
          htmlDom(element).attr("href", options.cssBundleName);
          options.pluginInstance.addLinkedStyleResource(cssHref);
          elementReplaced = true;
        } else {
          // remove complete tag
          htmlDom(element).replaceWith("<!-- " + cssHref + " -->");
          options.pluginInstance.addLinkedStyleResource(cssHref);
        }

        htmlDom(element).after("\n<script> require(\"" + cssHref + "\"); </script>");
      }
    });
  }

  console.log(htmlDom.html());

  return htmlDom.html();
}

module.exports = linkedCssBundlerLoader;