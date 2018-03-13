const path = require("path");
const validateOptions = require("schema-utils");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const jsonValidator = require("./util/json-validator");


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
    outputPath: {
      description: "directory where the output is send to",
      type: "string"
    },
  }
};

module.exports = function(options) {

  jsonValidator.validate(options, optionsSchema).throwOnError();

  return {
    /** *****************************************
     *  Configuration for transpiling / bundling required node modules
     */
    entry: options.entries,

    output: {
      path: path.resolve(__dirname, options.outputPath),
      filename: "[name].js",
      library: "[name]",
      libraryTarget: "umd",
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
          // Exclude bower_components and node_modules from transpilation:
          exclude: /node_modules|bower_components\/.*/
        },
        {
          // If you see a file that ends in .html, send it to these loaders.
          test: /\.html$/,
          // Chained loaders run last to first.
          use: [
            { loader: "babel-loader",
              options: {
                presets: ["babel-preset-env"],
                plugins: ['babel-plugin-transform-runtime'],
                compact: true // use compact: false to suppress removing whitespaces
              }},
            { loader: "polymer-webpack-loader" }
          ],
        },
      ]
    },

    plugins: [
      // This plugin will copy files over for us without transforming them. The custom-elements-es5-adapter.js MUST remain in ES2015!
      new CopyWebpackPlugin([
        {from: path.resolve(__dirname, "./node_modules/@webcomponents/webcomponentsjs/*.js"), to: "webcomponentsjs/[name].[ext]"},
      ]),
    ],

    devtool: "source-map"
  };
};
