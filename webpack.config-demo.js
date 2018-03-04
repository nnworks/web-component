const path = require("path");
const WcHelperPlugin = require("./util/plugins/wc-helper-plugin/wc-helper-plugin");
const jsonValidator = require("./util/json-validator");


const optionsSchema = {
  $schema: "http://json-schema.org/draft-06/schema#",
  title: "Options checking schema",
  type: "object",
  required: ["outputPath"],
  properties: {
    resourceCopyOptions: {
      description: "settings for copying the resources referred to in the processed files",
      type: "object",
      required: ["extensions"],
      properties: {
        extensions: {
          description: "specify extensions that need to be copied, '|' separated. Example: png|jpg|jpeg",
          type: "string"
        }
      }
    },
    srcDir: {
      description: "base path to find the demo code to build in (for example 'src/demo')",
      type: "string"
    },
    outputPath: {
      description: "path to store the demo in (relative to the dist directory)",
      type: "string"
    }
  }
};

/**
 * Create entries set from array
 * @param options
 * @returns entries object
 */
function createEntriesFromOptions(options) {
  var entries = {};
  for (let index = 0; index < options.htmlFiles.length; index++) {
    entries["demoBundle" + index] = options.htmlFiles[index];
  }

  return entries;
}

module.exports = function(options) {

  jsonValidator.validate(options, optionsSchema, "Demo Configuration").throwOnError();

  var entries = createEntriesFromOptions(options);

  var wcHelperPlugin = new WcHelperPlugin({ bundles: Object.getOwnPropertyNames(entries),
                                            supportLibsPath: options.supportLibsPath,
                                            wcHelperBundle: options.wcHelperBundle });

  var config = {

    context: (typeof options.srcDir !== "undefined")? options.srcDir : "",

    /** *****************************************
     *  Main configuration for the web component
     */
    entry: entries,

    output: {
      path: path.resolve(__dirname, "dist/demo"),
      filename: "[name]-bundle.js",
    },

    resolve: {
      modules: [
        path.resolve(__dirname, "node_modules"),
      ]
    },

    // These rules tell Webpack how to process different module types.
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [
            { loader: "file-loader", options: { name: "[path][name].[ext]", useRelativePath: false }},
            { loader: "extract-loader", options: { publicPath: "../" }},
            { loader: "html-loader", options: {minimize: false, removeComments: false, collapseWhitespace: false, attrs: ['img:src', 'link:href'] }},
            wcHelperPlugin.loader()
          ]
        },

        {
          test: new RegExp("\\.(" + options.resourceCopyOptions.extensions + ")$"),
          use: [
            { loader: "file-loader", options: {name: "[path][name].[ext]", useRelativePath: false}}
          ]
        }
      ]
    },

    plugins: [
      wcHelperPlugin,
    ],

    // Will be put in the modules dist folder package.json if the generate-package-json-webpack-plugin
    externals: {
    },

    devServer: {
      contentBase: path.join(__dirname, "./"),
        compress: true,
        port: 9000
    },

    devtool: "source-map"
  };

  return config;
};


