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


module.exports = function(options) {

  return {
    /** *****************************************
     *  Main configuration for the web component
     */
    entry: {
      "web-component": "./src/html/web-component.html"
    },

    output: {
      path: path.resolve(__dirname, "dist"),
        filename: "[name]-bundle.js",
    },

    resolve: {
      modules: [
        path.resolve(__dirname, "node_modules"),
      ]
    },

    resolveLoader: {
      modules: [
        'node_modules',
        path.resolve(__dirname, 'util/loaders')
      ]
    },

    // These rules tell Webpack how to process different module types.
    module: {
      rules: [
        {
          // all files that end in .js
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["babel-preset-env"],
                plugins: ['babel-plugin-transform-runtime'],
                compact: true // use compact: false to suppress removing whitespaces
              }}
          ],
          // Exclude bower_components and node_modules from transpilation except for polymer-webpack-loader:
          exclude: /node_modules\/(?!polymer-webpack-loader\/)|\/bower_components\/.*/
        },

      ]
    },

    plugins: [
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, "src/html/index.html"),
        inject: false,
        filename: "demo/index.html"}),
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


