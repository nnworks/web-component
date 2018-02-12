let validateOptions = require("schema-utils");

const schema = {
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

    validateOptions(schema, options, "wc-helper-plugin");

  }

  apply(compiler) {

    /**
     * Build a module with all the required styles sheet files as dependencies
     */
    compiler.plugin('emit', function(compilation, callback) {
      compilation.assets["webpack-wc-helper.js"] =

      callback();
    }.bind(this));


    compiler.plugin("emit", function (compilation, callback) {
      compilation.fileDependencies.push(path.join(compiler.context, template));
      // ...
    });

  }

}



module.exports = MonitoringPlugin;