"use strict";

const path = require("path");
const cheerio = require("cheerio");
const loaderUtils = require("loader-utils");
const validateOptions = require("schema-utils");
const vm = require("vm");

const WCHELPER_SELECTOR = "wc-helper";
const WCHELPER_JS = "webpacked-wc-helper.js";

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

function createModuleOfString(src, requirePaths) {
  // escape double quotes
  var result = src.replace(/\"/g, "\\\"").replace(/\n/g, "\\n");

  // replace the placeholders by required resources
  for (let index = 0; index < requirePaths.length; index++) {
    result = result.replace("$req-" + index, "\" + require(\"" + requirePaths[index] + "\") + \"");
  }

  return "module.exports = \"" + result + "\"";
}

/**
 * Prefix bundles with support lib path
 * @param bundles
 * @param supportLibsPath
 * @returns {string}
 */
function createBundleString(bundles, supportLibsPath) {
  let bundleString = "";
  for (let index = 0; index < bundles.length; index++) {
    if (index > 0) bundleString += ", ";
    bundleString += supportLibsPath + "/" + bundles[index].trim();
  }

  return bundleString;
}

function replaceWCHelperTag(htmlSrcJs, options) {

  let requirePaths = [];
  let sandbox = {
    module: function(){},

    require: function(requirePath) {
      // store required urls, to be able to replace them later
      requirePaths.push(requirePath);
      return "$req-" + (requirePaths.length - 1);
    }.bind(this)

  };
  vm.createContext(sandbox);
  vm.runInContext(htmlSrcJs, sandbox);

  let html = sandbox.module.exports;

  // parse html in xml mode to leave all as is
  let htmlDom = cheerio.load(html, {normalizeWhitespace: false, xmlMode: true});
  let elements = htmlDom(WCHELPER_SELECTOR);

  for (let index = 0; index < elements.length; index++) {
    let element = elements[index];
    let supportLibBundles = htmlDom(element).attr("supportLibBundles");
    let webComponentBundles = htmlDom(element).attr("webComponentBundles");
    let id = "webpacked-wc-helper-" + index;

    let helperTag =
      "<script id=\"" + id
      + "\" language=\"javascript\" src=\"" + WCHELPER_JS
      + "\" bundles=\"" + createBundleString(supportLibBundles.split(","), options.supportLibsPath)
      + "\" wc-location=\"" + options.webComponentJsPath
      + "\"></script>";

    // insert wc-helper script
    htmlDom(element).replaceWith(helperTag);
  }

  // process the htmlDOM to string
  let result = htmlDom.html();

  return createModuleOfString(result, requirePaths);
}

/**
 * Bundles style files (css & scss) to replace the currently linked one.
 * @param srcToProcess source of the html file
 * @param map
 * @param meta
 * @returns the changed html
 */
function wcHelperLoader(srcToProcess, map, meta) {

  this.cacheable();
  var asyncCallback = this.async();

  const options = loaderUtils.getOptions(this) || {};
  // validateOptions(schema, options, "resource-copier-loader");

  let relativePath = path.relative(path.dirname(this.resourcePath), __dirname)
  let helperJs = "!file-loader?name=[name].js&useRelativePath=false!" + relativePath + "/" + WCHELPER_JS;

  this.loadModule(helperJs, (err, moduleSource, sourceMap, module) => {
    let result = replaceWCHelperTag(srcToProcess, options);
    asyncCallback(null, result, map, meta);
  });
}

// expose schema
wcHelperLoader.schema = schema;
module.exports = wcHelperLoader;