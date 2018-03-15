"use strict";

const path = require("path");
const cheerio = require("cheerio");
const loaderUtils = require("loader-utils");
const validateOptions = require("schema-utils");
const vm = require("vm");

const WCHELPER_SELECTOR = "wc-helper";

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

function replaceWCHelperTag(src) {

}

/**
 * Bundles style files (css & scss) to replace the currently linked one.
 * @param src src of the html file
 * @param map
 * @param meta
 * @returns the changed html
 */
function wcHelperLoader(src, map, meta) {

  this.cacheable();
  var asyncCallback = this.async();

  const options = loaderUtils.getOptions(this) || {};
  // validateOptions(schema, options, "resource-copier-loader");


  let relativePath = path.relative(path.dirname(this.resourcePath), __dirname)
  //let id = "webpacked-wc-helper-" + index;
  let src = "!file-loader?name=[name].js&useRelativePath=false!" + relativePath + "/webpacked-wc-helper.js";

  this.loadModule(src, (err, source, sourceMap, module) => {

    replaceWCHelperTag(src);

    let result = src;
    asyncCallback(null, result, map, meta);
  });


  /*

  // parse html in xml mode to leave all as is
  var htmlDom = cheerio.load(src, {normalizeWhitespace: false, xmlMode: true});

  var elements = htmlDom(WCHELPER_SELECTOR);

  for (let index = 0; index < elements.length; index++) {
    let element = elements[index];
    let supportLibBundles = htmlDom(element).attr("supportLibBundles");
    let webComponentBundles = htmlDom(element).attr("webComponentBundles");

    // prepend supportlibs
    console.log("wc bundles: " + supportLibBundles);

    let relativePath = path.relative(path.dirname(this.resourcePath), __dirname)
    let id = "webpacked-wc-helper-" + index;
    let src = relativePath + "/webpacked-wc-helper.js";
//    let src = require.resolve(relativePath + "/webpacked-wc-helper.js");

    this.addDependency(src);

    console.log(src);
    let helperTag = "<script id=\"" + id + "\" language=\"javascript\" src=\"" + src + "\" bundles=\"" + supportLibBundles + "\" wc-location=\"" + "dfd"+ "\"></script>";

    // insert wc-helper script
    htmlDom(element).replaceWith(helperTag);

    return htmlDom.html();
  }

  */
}

// expose schema
wcHelperLoader.schema = schema;

module.exports = wcHelperLoader;

module.exports.pitch = function() {

}