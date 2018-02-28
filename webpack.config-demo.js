const path = require("path");
const GeneratePackageJsonPlugin = require("generate-package-json-webpack-plugin");
const WcHelperPlugin = require("./util/plugins/wc-helper-plugin");
const MonitoringPlugin = require("./util/plugins/monitoring-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const packageJSON = require("./package.json");
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

function createEntriesFromOptions(options) {
  var entries = {};
  for (let index = 0; index < options.htmlFiles.length; index++) {
    entries["file" + index] = options.htmlFiles[index];
  }

  return entries;
}

var wcHelperPlugin = new WcHelperPlugin({});


module.exports = function(options) {

  jsonValidator.validate(options, optionsSchema, "Demo Configuration").throwOnError();

  return {

    context: (typeof options.srcDir !== "undefined")? options.srcDir : "",

    /** *****************************************
     *  Main configuration for the web component
     */
    entry: createEntriesFromOptions(options),

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
            { loader: "html-loader", options: {minimize: false, removeComments: false, collapseWhitespace: false }},
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

}


