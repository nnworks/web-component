const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MonitoringPlugin = require("./util/plugins/monitoring-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const packageJSON = require('./package.json');
const validateOptions = require("schema-utils");


const optionsSchema = {
  $schema: "http://json-schema.org/draft-06/schema#",
  title: "Options checking schema",
  type: "object",
  required: ["entries"],
  properties: {
    entries: {
      description: "entries object",
      type: "object"
    },
    cssBundlePath: {
      description: "path for linked bundled css file",
      type: "string"
    },
    scssBasePaths: {
      description: "array with directories where scss files can be found",
      type: "array",
      items: {
        type: "string"
      }
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


module.exports = function(options) {

  return {

    context: (typeof options.srcDir !== "undefined")? options.srcDir : "",

    /** *****************************************
     *  Main configuration for the web component
     */
    entry: createEntriesFromOptions(options),

    output: {
      path: path.resolve(__dirname, "dist"),
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
            { loader: "file-loader", options: { name: "[path][name].[ext]" }},
            { loader: "extract-loader", options: {}},
            { loader: "html-loader", options: {}}
          ]
        }

      ]
    },

    plugins: [
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


