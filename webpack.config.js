var mainConfig = require("./webpack.config-main");
var polymerConfig = require("./webpack.config-polymer");
var modulesConfig = require("./webpack.config-modules");


module.exports = [
  /** *****************************************
   *  Main configuration for the web component
   */
  mainConfig,

  /** **************************
   *  Polymer web component libs
   */
  polymerConfig,

  /** *****************************************
   *  Configuration for transpiling / bundling required node modules
   */
  modulesConfig,
];
