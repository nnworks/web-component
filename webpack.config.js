var mainConfig = require("./webpack.config-main");
var stylesheetsConfig = require("./webpack.config-stylesheets");
var polymerConfig = require("./webpack.config-polymer");
var externalModulesConfig = require("./webpack.config-external-modules");


module.exports = function build(env) {

  if (typeof env !== 'undefined') {
    console.log("Building for environment: ");
    console.log(env);
  }

  return [
    /** *****************************************
     *  Main configuration for the web component
     */
    mainConfig,

    /** **************************
     *  Polymer web component libs
     */
    polymerConfig,

    /** *****************************************
     *  Configuration for transpiling / bundling required external node modules
     */
    externalModulesConfig,
  ];
}
