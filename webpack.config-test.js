const path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FilterChunkPlugin = require('filter-chunk-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


// bundle name (will be filtered out)
const assetBundleName = "do-not-emit.js";
const cssBundleName = "styles-bundle.css";

module.exports = {
  /** *****************************************
   *  Main configuration for the web component
   */
  //entry: glob.sync(cssGlob).concat(glob.sync(scssGlob)),
  entry: "./src/html/test.html",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: assetBundleName,
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
        test: /\.css$/,
         use: ExtractTextPlugin.extract({
               use: [
                 { loader: "css-loader", options: { url: false, minimize: false }}
               ]
             }),
      },
      {
        test: /\.html$/,
        use: [
          {loader: "test-loader"}
        ]
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({ filename: cssBundleName, allChunks: true }),
    new FilterChunkPlugin({ patterns: [assetBundleName, "0." + assetBundleName] }),
    new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
  ],
};

