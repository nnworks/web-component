var mainConfig = require("./webpack.config-main");
var polymerConfig = require("./webpack.config-polymer");
var supportLibsConfig = require("./webpack.config-supportlibs");


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
      entries: { "web-component": "./src/html/web-component.html" },
      cssBundlePath: "css/styles.css",
      inlineSassTranspilerOptions: { scssBasePaths: ["src/scss"] },
      resourcesCopierLoaderOptions: { resourceSelectors: [{ resourcePath: "img", selector: "img", attr: "src" }]}
    }),

    /** **************************
     *  Polymer web component libs
     */
    //polymerConfig,

    /** *****************************************
     *  Configuration for transpiling / bundling required external node modules
     */
    supportLibsConfig({
      entries: { "polymer": "./node_modules/@polymer/polymer/polymer-element.html",
                 "axios": "./node_modules/axios/lib/axios.js",
                 "webpack-wc-helper": "./util/webpack-wc-helper.js" },
      supportLibsPath: "support-libs"
    })
  ];
};
