const path = require("path");
var mainConfig = require("./webpack.config-main");
var demoConfig = require("./webpack.config-demo");
var supportLibsConfig = require("./webpack.config-supportlibs");


var srcDir = "src";


module.exports = function build(env) {

  if (typeof env !== 'undefined') {
    console.log("Building for environment: ");
    console.log(env);
  }

  return [
    /** *****************************************
     *  Main configuration for the web component
     */
    mainConfig({
      srcDir: path.resolve(__dirname, srcDir),
      entries: { "web-component-bundle": "./html/web-component.html" },
      outputPath: "dist/demo",
      linkedStyleBundlerLoaderOptions: { cssBundlePath: "css/styles.css" },
      inlineSassTranspilerOptions: { scssBasePaths: ["src/scss"] },
      resourceCopyOptions: { extensions: "png|jpg" }
    }),

    /** *****************************************
     *  Configuration for transpiling / bundling required external node modules
     */
    supportLibsConfig({
      entries: { "polymer-bundle": "./node_modules/@polymer/polymer/polymer-element.html",
                 "axios-bundle": "./node_modules/axios/lib/axios.js" },
      outputPath: "dist/demo",
      supportLibsPath: "support-libs"
    }),

    /** *****************************************
     * Configuration for generating demo files to show the component
     */
    demoConfig({
      srcDir: path.resolve(__dirname, srcDir + "/demo"),
      outputPath: "dist/demo",
      htmlFiles: ["./html/demo.html"], // demo html files
      resourceCopyOptions: { extensions: "png|jpg" }, // resources to copy
      webComponentBundles: ["web-component-bundle"],
      supportBundles: ["polymer-bundle", "axios-bundle"], // bundles needed by web component
      supportLibsPath: "../support-libs", // relative to outputPath
    })
  ];
};
