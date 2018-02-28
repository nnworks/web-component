const path = require("path");
const jsonValidator = require("../json-validator");


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

function loaderFunction(content, map, meta) {
  this.cacheable();

  return content;
}

class WCHelperPlugin {

  constructor(options) {
    //jsonValidator.validate(options, optionsSchema, "wc-helper-plugin").throwOnError();

    this.options = options;
  }

  loader() {
    return loaderFunction;
  }

  apply(compiler) {

    /**
     * Build a module with all the required styles sheet files as dependencies
     */
    compiler.plugin('emit', function(compilation, callback) {
      //compilation.assets["webpack-wc-helper.js"] =

      callback();
    }.bind(this));


    compiler.plugin("emit", function (compilation, callback) {
//      compilation.fileDependencies.push(path.join(compiler.context, template));
      // ...
    });

  }

}



module.exports = WCHelperPlugin;