const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  /** **************************
   *  Polymer web component libs
   */
    entry: {
      "polymer": "./node_modules/@polymer/polymer/polymer-element.html",
    },

    output: {
      path: path.resolve(__dirname, "dist/support-lib"),
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
          // Exclude starting point of bundle
          exclude: /src\/html\/index\.html$/,
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
