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
     * Build a module with all the required styles sheet files as dependencies
     */
    compiler.plugin('emit', function(compilation, callback) {
      var assets = Object.getOwnPropertyNames(compilation.assets);

      for (var assetIndex = 0; assetIndex < assets.length; assetIndex++) {
        var key = assets[assetIndex];
      //   if (this.options.compilation.assets[key]) {
      //      delete compilation.assets[key];
      //      console.log("delete " + key);
      //   }
      }

      // compilation.assets["webpack-wc-helper.js"] =
      // compilation.fileDependencies.push(path.join(compiler.context, template));
      // delete compilation.assets[key]

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