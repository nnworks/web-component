const path = require("path");
const GeneratePackageJsonPlugin = require("generate-package-json-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const packageJSON = require("./package.json");
const jsonValidator = require("./util/json-validator");

const inlineSassTranspilerSchema = require("./util/loaders/inline-sass-transpiler/inline-sass-transpiler").optionsSchema;


const optionsSchema = {
  $schema: "http://json-schema.org/draft-06/schema#",
  title: "Options checking schema",
  type: "object",
  required: ["entries", "outputPath"],
  properties: {
    srcDir: {
      description: "base path to find the project code to build in (for example 'src')",
      type: "string"
    },

    outputPath: {
      description: "path to store the demo in (relative to the dist directory)",
      type: "string"
    },

    entries: {
      description: "entries object",
      type: "object"
    },

    cssBundlePath: {
      description: "path for linked bundled css file",
      type: "string"
    },

    scssBasePaths: inlineSassTranspilerSchema,

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
    }
  }
};

/**
 *  Main configuration for the web component. Generates the web-component bundle, a css bundle for all
 *  linked css and scss files.
 *  Needs to copy all resources (images etc from a resource directory, sources are not automatically processed)...
 *
 */
module.exports = function(options) {

  jsonValidator.validate(options, optionsSchema, "Main Configuration").throwOnError();

  var config = {

    context: (typeof options.srcDir !== "undefined")? options.srcDir : "",

    entry: options.entries,

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
    },

    resolve: {
      modules: [
        path.resolve(__dirname, "node_modules"),
      ]
    },

    resolveLoader: {
      modules: [
        "node_modules",
        path.resolve(__dirname, "util/loaders/inline-sass-transpiler"),
        path.resolve(__dirname, "util/loaders/linked-style-bundler-loader")
      ]
    },

    // These rules tell Webpack how to process different module types.
    module: {
      rules: [
        {
          // If you see a file that ends in .html, send it to these loaders.
          test: /\.html$/,
          // Chained loaders run last to first.
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["env"],
                compact: true // use compact: false to suppress removing whitespaces
              }
            },
            { loader: "polymer-webpack-loader", options: {} },
            { loader: "inline-sass-transpiler", options: options.inlineSassTranspilerOptions },
            { loader: "linked-style-bundler-loader", options: options.linkedStyleBundlerLoaderOptions }
          ],
          // Exclude starting point of bundle
          exclude: /src\/html\/index\.html$/,
        },

        {
          // all files that end in .js
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["babel-preset-env"],
                plugins: ["babel-plugin-transform-runtime"],
                compact: true // use compact: false to suppress removing whitespaces
              }}
          ],
          // Exclude bower_components and node_modules from transpilation except for polymer-webpack-loader:
          exclude: /node_modules\/(?!polymer-webpack-loader\/)|\/bower_components\/.*/
        },

        {
          // all files that end in .css
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: [
              { loader: "css-loader", options: { } },
            ]
          })
        },

        {
          test: /\.scss$/,
          use:
            ExtractTextPlugin.extract({
              use: [
                { loader: "css-loader", options: { url: false, minimize: false }},
                { loader: "sass-loader", options: {}},
              ]
            })
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
      // to separate config?
      new GeneratePackageJsonPlugin({
        "name": packageJSON.name,
        "version": packageJSON.version,
        "description": packageJSON.description,
        "main": packageJSON.main,
        "author": packageJSON.author,
        "license": packageJSON.license,
        "engines": packageJSON.engines,
      }, __dirname + "/package.json"),
      new ExtractTextPlugin({ filename: options.linkedStyleBundlerLoaderOptions.cssBundlePath, allChunks: true }),
      // creates a bundle content report
      new BundleAnalyzerPlugin({ analyzerMode: "static", openAnalyzer: false, reportFilename: "bundle-content-report.html" }),
    ],

    // Will be put in the modules dist folder package.json if the generate-package-json-webpack-plugin is used
    externals: {
      axios: "axios",
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

