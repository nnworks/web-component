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
    console.log(loaderSpec);
    return loaderSpec;
  }

  apply(compiler) {

    /**
     * Build a module with all the required styles sheet files as dependencies
     */
    compiler.plugin('emit', function(compilation, callback) {
      // compilation.assets["webpack-wc-helper.js"] =
      // compilation.fileDependencies.push(path.join(compiler.context, template));

      callback();
    }.bind(this));
  }
}

module.exports = WCHelperPlugin;