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
 * Prefix supportBundles with support lib path
 * @param supportBundles Array
 * @param supportLibsPath path to support libraries folder, relative to the file that is passing through this loader.
 * @returns comma separated string with supportBundles
 */
function createSupportBundleString(supportBundles, supportLibsPath) {
  return supportBundles.map((bundle) =>  path.join(supportLibsPath, bundle.trim()));
}

function createWcBundleString(wcBundles, distPath) {
  return wcBundles.map((bundle) =>  path.join(distPath, bundle.trim()));
}

function replaceWCHelperTag(htmlSrcJs, pathToPublic, pathToOutput, options) {

  // create sandbox with just enough to let the html be evaluated...
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

    let bundles = createSupportBundleString(supportLibBundles.split(","), path.join(pathToPublic, options.supportLibsPath));
    bundles = bundles.concat(createWcBundleString(webComponentBundles.split(","), pathToPublic));

    let helperTag =
      "<script id=\"" + id
      + "\" language=\"javascript\" src=\"" + path.join(pathToOutput, WCHELPER_JS)
      + "\" bundles=\"" + bundles.join(", ")
      + "\" wc-location=\"" + path.join(pathToPublic, options.webComponentsJsPath)
      + "\"> </script>";

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

  // resolve path to the helper containing folder from the currently processed resource
  let relResourcePath = path.relative(path.dirname(this.resourcePath), __dirname);
  // create path to WCHELPER relative to currently processed resource
  let helperJsPath = "!file-loader?name=[name].js&useRelativePath=false!" + path.join(relResourcePath, WCHELPER_JS);

  // resolve path to base of build output directory
  var relPathToOutput = path.relative(path.dirname(this.resourcePath), this.options.context);
  var relPathToPublic = path.join(relPathToOutput, options.publicPath);

  this.loadModule(helperJsPath, (err, moduleSource, sourceMap, module) => {
    let result = replaceWCHelperTag(srcToProcess, relPathToPublic, relPathToOutput, options);
    asyncCallback(null, result, map, meta);
  });
}

// expose schema
wcHelperLoader.schema = schema;
module.exports = wcHelperLoader;