const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin');
const LinkedCSSPlugin = require('./util/plugins/linked-css-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FilterChunkPlugin = require('filter-chunk-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const packageJSON = require('./package.json');


// for css link extractionbundle name (will be filtered out)
const cssJsBundleName = "do-not-emit.js";
const cssBundleName = "styles-bundle.css";
var linkedCssPlugin = new LinkedCSSPlugin();

module.exports = {
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
          // all files that end in .html
          test: /\.html$/,
          // Chained loaders run last to first.
          use: [
            /** transpile to ES5 */
            { loader: "babel-loader",
              options: {
                presets: ["env"],
                compact: true // use compact: false to suppress removing whitespaces
              }
            },
            /** Converts polymer html imports etc... */
            { loader: "polymer-webpack-loader",
              options: {
                processStyleLinks: true,
              }
            },
            /** transpile 'inlined' scss to css, keep it in the same tag */
            { loader: "inline-sass-transpiler",
              options: {
                scssBasePaths: ["src/scss"]
              }
            },
            /** loader that changes css link hrefs to the separately bundled .css file specified for the plugin instance */
            linkedCssPlugin.loader({})
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
                plugins: ['babel-plugin-transform-runtime'],
                compact: true // use compact: false to suppress removing whitespaces
              }}
          ],
          // Exclude bower_components and node_modules from transpilation except for polymer-webpack-loader:
          exclude: /node_modules\/(?!polymer-webpack-loader\/)|\/bower_components\/.*/
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
                use: [
                  { loader: "css-loader", options: { url: false, minimize: false }}
                ]
          }),
        },
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, "src/html/index.html"), inject: false }),
      new GeneratePackageJsonPlugin({
        "name": packageJSON.name,
        "version": packageJSON.version,
        "description": packageJSON.description,
        "main": packageJSON.main,
        "author": packageJSON.author,
        "license": packageJSON.license,
        "engines": packageJSON.engines,
      }, __dirname + "/package.json"),
      new ExtractTextPlugin({ filename: cssBundleName, allChunks: true }),
      new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
      linkedCssPlugin,
    ],

    // Use generate-package-json-webpack-plugin for creating a package.json from the externals
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

