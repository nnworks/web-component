var version = "1.0.0";
var ArgParser = require("argparse").ArgumentParser;


/**
 * Configure the argument parser.
 *
 * var xyz = subParsers.addParser("xyz", {
 *   addHelp: true,
 *   help: "xyz help" });
 *
 * xyz.addArgument([ "-p", "--ppp" ], {
 *   action: "store",
 *   defaultValue: "yes",
 *   metavar: "var value in help message",
 *   choices: ["yes", "no"],
 *   // for a no flag use action and constant
 *   action: "storeConst",
 *   constant: "do p",
 *   help: "help text for do p"});
 *
 */

/**
 * structure:
 *   preProcess
 *   build
 *   package
 */


var parser = new ArgParser({
  version: version,
  addHelp: true,
  namespace: arguments,
  description: "Dispatcher for command line commands",
});


var subParsers = parser.addSubparsers({
  title: "Commands",
  dest: "command",
});

var cleanParser = subParsers.addParser("clean", {
  addHelp: true,
  help: "clean the build and preprocess folders"
});

var preprocess = subParsers.addParser("preprocess", {
  addHelp: true,
  help: ".scss transpilation and embededded scss transpilation"
});

var buildParser = subParsers.addParser("build", {
  addHelp: true,
  help: "build the component"
});

var unittestParser = subParsers.addParser("unittest", {
  addHelp: true,
  help: "package the component for distribution"
});

var packageParser = subParsers.addParser("package", {
  addHelp: true,
  help: "package the component for distribution"
});

var serveParser = subParsers.addParser("serve", {
  addHelp: true,
  help: "serve the build component"
});

serveParser.addArgument(["-o", "--open"], {
  action: "store",
  defaultValue: "false",
  action: "storeConst",
  constant: "true",
  help: "open a browser and show components index.html"
});

module.exports = {
  parser: parser
}