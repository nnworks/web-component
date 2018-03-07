const path = require("path");
const jsonValidator = require("../../json-validator");


const optionsSchema = {
  $schema: "http://json-schema.org/draft-06/schema#",
  title: "Options checking schema",
  type: "object",
  required: ["libFolder"],
  properties: {
    libFolder: {
      description: "folder in the distribution folder for supporting scripts",
      type: "string",
    },
  }
};

class WCHelperPlugin {

  constructor(options) {
    //jsonValidator.validate(options, optionsSchema, "wc-helper-plugin").throwOnError();

    this.options = options;
  }

  loader() {
    var loaderSpec = { loader: require.resolve('./wc-helper-loader'), options: this.options };
    return loaderSpec;
  }

  apply(compiler) {

    /**
     * remove the Build a module with all the required styles sheet files as dependencies
     */
    compiler.plugin('emit', function(compilation, callback) {
      var assets = Object.getOwnPropertyNames(compilation.assets);

      for (var assetIndex = 0; assetIndex < assets.length; assetIndex++) {
        for (var rmChunkIndex = 0; rmChunkIndex < this.options.removeChunks.length; rmChunkIndex++) {
          var assetKey = assets[assetIndex];
          if (assetKey.startsWith(this.options.removeChunks[rmChunkIndex])) {
            delete compilation.assets[assetKey];
          }
        }
      }

      callback();
    }.bind(this));
  }

  /**
   * For gettting the pach
   * @returns {string}
   */
  static getHelperJsPath() {
    return __dirname + "/webpacked-wc-helper.js";
  }
}

module.exports = WCHelperPlugin;