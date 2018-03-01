"use strict";

const cheerio = require("cheerio");
const loaderUtils = require("loader-utils");
const validateOptions = require("schema-utils");


const schema = {
  $schema: "http://json-schema.org/draft-06/schema#",
  title: "Options checking schema",
  description: "wc-helper-loader options schema",
  type: "object",
  required: [],
  properties: {
    resourceSelectors: {
      type: "array",
      required: ["resourcePath", "selector", "attr"],
      items: {
        resourcePath: {
          description: "path in the distribution directory to put the resources in",
          type: "string",
        },
        selector: {
          description: "xpath selector for matching the elements of which the src should be copied like { \"link[rel=\\\"stylesheet\\\"]\" , \"href\" }",
          type: "string"
        },
        attr: {
          description: "attribute to read the resource from like src or href",
          type: "string"
        }
      }
    }
  }
};

/**
 * Bundles style files (css & scss) to replace the currently linked one.
 * @param content content of the html file
 * @param map
 * @param meta
 * @returns the changed html
 */
function WcHelperLoader(content, map, meta) {

  this.cacheable();

  console.log("wc-helper-loader");

  // const options = loaderUtils.getOptions(this) || {};
  // validateOptions(schema, options, "resource-copier-loader");
  //
  // // parse html in xml mode to leave all as is
  // var htmlDom = cheerio.load(content, {normalizeWhitespace: false, xmlMode: true});
  //
  // // loop over all element selectors
  // for (let index = 0; index < options.resourceSelectors.length; index++) {
  //   var selector = options.resourceSelectors[index];
  //   var elements = htmlDom(selector.selector);
  //   for (let index = 0; index < elements.length; index++) {
  //     let element = elements[index];
  //     var resourceUri = htmlDom(element).attr(selector.attr);
  //     console.log("resource uri: " + resourceUri);
  //   }
  // }

  // if (cssLinkElements) {
  //   var elementReplaced = false;
  //   cssLinkElements.each(function(i, element) {
  //     var cssHref = htmlDom(element).attr("href");
  //     if (cssHref) {
  //       // add  require for css
  //       htmlDom(element).after("\n<script> require(\"" + cssHref + "\"); </script>");
  //
  //       if(!elementReplaced) {
  //         // replace href attribute
  //         htmlDom(element).attr("href", options.cssBundlePath);
  //         elementReplaced = true;
  //       } else {
  //         // remove complete tag
  //         htmlDom(element).replaceWith("<!-- " + cssHref + " -->");
  //       }
  //     }
  //   });
  // }

  // return htmlDom.html();
  return content;
}

// expose schema
WcHelperLoader.schema = schema;
module.exports = WcHelperLoader;