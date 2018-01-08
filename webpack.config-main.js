const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");


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
            { loader: "polymer-webpack-loader" },
            {
              loader: "inline-sass-transpiler",
              options: {
                scssPath: ["src/scss"]
              }
            }
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
                //plugins: ['babel-plugin-transform-runtime'],
                compact: true // use compact: false to suppress removing whitespaces
              }}
          ],
          // Exclude bower_components and node_modules from transpilation except for polymer-webpack-loader:
          exclude: /node_modules\/(?!polymer-webpack-loader\/)|\/bower_components\/.*/
        },
        {
          // all files that end in .css
          test: /\.css$/,
          use: [
            "css-loader",
          ]
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin(
        {
          template: path.resolve(__dirname, "src/html/index.html"),
          inject: false
        }
      ),
    ],

    externals: {
      axios: "axios"
    },

    devServer: {
      contentBase: path.join(__dirname, "./"),
      compress: true,
      port: 9000
    },

    devtool: "source-map"
  };

