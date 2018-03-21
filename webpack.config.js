const path = require("path");
var mainConfig = require("./webpack.config-main");
var demoConfig = require("./webpack.config-demo");
var supportLibsConfig = require("./webpack.config-supportlibs");


var srcDir = "src";
var outputDir = "dist";


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
      outputPath: outputDir,
      linkedStyleBundlerLoaderOptions: { cssBundlePath: "css/styles.css" },
      inlineSassTranspilerOptions: { scssBasePaths: ["src/scss"] },
      resourceCopyOptions: { extensions: "png|jpg" }
    }),

    /** *****************************************
     *  Configuration for transpiling / bundling required external node modules
     */
    supportLibsConfig({
      entries: { "polymer": "./node_modules/@polymer/polymer/polymer-element.html",
                 "axios": "./node_modules/axios/lib/axios.js" },
      outputPath:  path.resolve(outputDir, "support-libs")
    }),

    /** *****************************************
     * Configuration for generating demo files to show the component
     */
    demoConfig({
      srcDir: path.resolve(__dirname, srcDir + "/demo"),
      outputPath: "dist/demo", // path where demo should be put
      publicPath: "../", // base path for the 'common' build relatively to the outputPath
      htmlFiles: ["./html/demo.html"], // demo html files
      resourceCopyOptions: { extensions: "png|jpg|js" }, // resources to copy when encountered in demo page(s),
      webComponentsJsPath: "support-libs/webcomponentsjs", // path to webcomponentjs files, relative to the publicPath
      supportLibsPath: "support-libs", // path to support libraries, relative to publicPath
    })
  ];
};
