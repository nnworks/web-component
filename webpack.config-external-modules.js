const path = require("path");

module.exports = {
  /** *****************************************
   *  Configuration for transpiling / bundling required node modules
   */
    entry: {
      "axios": "./node_modules/axios/lib/axios.js",
      "webpack-wc-helper": "./util/webpack-wc-helper.js",
    },

    output: {
      path: path.resolve(__dirname, "dist/support-lib"),
      filename: "[name]-bundle.js",
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
        }
      ]
    },

    plugins: [],

    devtool: "source-map"
  };
