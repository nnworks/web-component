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
      entries: { "web-component": "./html/web-component.html" },
      outputPath: "dist/demo",
      cssBundlePath: "css/styles.css",
      inlineSassTranspilerOptions: { scssBasePaths: ["src/scss"] },
      resourceCopyOptions: { extensions: "png|jpg" }
    }),

    /** *****************************************
     *  Configuration for transpiling / bundling required external node modules
     */
    supportLibsConfig({
      entries: { "polymer": "./node_modules/@polymer/polymer/polymer-element.html",
                 "axios": "./node_modules/axios/lib/axios.js",
                 "webpack-wc-helper": "./util/webpack-wc-helper.js" },
      outputPath: "dist/demo",
      supportLibsPath: "support-libs"
    }),

    demoConfig({
      srcDir: path.resolve(__dirname, srcDir + "/demo"),
      outputPath: "dist/demo",
      bundles: [],
      htmlFiles: ["./html/demo.html"],
      resourceCopyOptions: { extensions: "png|jpg" }
    })

  ];
};
