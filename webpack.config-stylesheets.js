const path = require("path");
const glob = require("glob");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FilterChunkPlugin = require('filter-chunk-webpack-plugin');


const cssGlob = path.resolve(__dirname, "src") + "/**/*.css";
const scssGlob = path.resolve(__dirname, "src") + "/**/*.scss";

// bundle name (will be filtered out)
const assetBundleName = "styles-bundle.js";
const cssOutputName = "styles.css";

module.exports = {
  /** *****************************************
   *  Main configuration for the web component
   */
    entry: glob.sync(cssGlob).concat(glob.sync(scssGlob)),

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: assetBundleName,
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
          test: /\.css$/,
          use:
            ExtractTextPlugin.extract({
              use: [
                { loader: "css-loader", options: { url: false, minimize: false }}
              ]
          })
        },
        {
          test: /\.scss$/,
          use:
            ExtractTextPlugin.extract({
              use: [
                { loader: "css-loader", options: { url: false, minimize: false }},
                { loader: "sass-loader", options: {}}
              ]
            })
        }
      ]
    },

    plugins: [
      new ExtractTextPlugin({ filename: "styles.css" }),
      new FilterChunkPlugin({ patterns: [assetBundleName] }),
    ],
  };

