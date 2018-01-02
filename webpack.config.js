const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = [
  /** *****************************************
   *  Main configuration for the web component
   */
  {
    entry: {
      "web-component": './src/html/web-component.html'
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name]-bundle.js',
    },

    resolve: {
      modules: [
        path.resolve(__dirname, 'node_modules'),
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
            { loader: 'babel-loader' },
            { loader: 'polymer-webpack-loader' }
          ],
          // Exclude starting point of bundle
          exclude: /src\/html\/index\.html$/,
        },
        {
          // all files that end in .js
          test: /\.js$/,
          use: [
            'babel-loader' //use 'babel-loader?compact=false'  // compact=false to suppress removing whitespaces
          ],
          // Exclude node_modules from transpilation except for polymer-webpack-loader:
          exclude: /node_modules\/(?!polymer-webpack-loader\/).*/
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin(
        {
          template: path.resolve(__dirname, 'src/html/index.html'),
          inject: false
        }
      ),
    ],

    externals: {
      axios: 'axios'
    },

    devServer: {
      contentBase: path.join(__dirname, "./"),
      compress: true,
      port: 9000
    },

    devtool: "source-map"
  },

  /** **************************
   *  Polymer web component libs
   */
  {
    entry: {
      "polymer": './node_modules/@polymer/polymer/polymer-element.html',
    },

    output: {
      path: path.resolve(__dirname, 'dist/lib'),
      filename: '[name]-bundle.js',
    },

    resolve: {
      modules: [
        path.resolve(__dirname, 'node_modules'),
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
            { loader: 'babel-loader' },
            { loader: 'polymer-webpack-loader' }
          ],
          // Exclude starting point of bundle
          exclude: /src\/html\/index\.html$/,
        },
        {
          // all files that end in .js
          test: /\.js$/,
          use: [
            'babel-loader' //use 'babel-loader?compact=false'  // compact=false to suppress removing whitespaces
          ],
          // Exclude node_modules from transpilation except for polymer-webpack-loader:
          exclude: /node_modules\/(?!polymer-webpack-loader\/).*/
        }
      ]
    },

    plugins: [
      // This plugin will copy files over for us without transforming them. The custom-elements-es5-adapter.js MUST remain in ES2015!
      new CopyWebpackPlugin([
        {from: path.resolve(__dirname, './node_modules/@webcomponents/webcomponentsjs/*.js'), to: 'webcomponentsjs/[name].[ext]'},
      ]),
    ],

    devtool: "source-map"
  },


  /** **************************************************************
   *  Configuration for transpiling / bundling required node modules
   */
  {
    entry: {
      "axios": './node_modules/axios/lib/axios.js',
      "webcomponents-helper": './src/js/webcomponents-helper.js',
    },

    output: {
      path: path.resolve(__dirname, 'dist/lib'),
      filename: "[name]-bundle.js",
      library: "[name]",
      libraryTarget: 'umd',
    },

    resolve: {
      modules: [
        path.resolve(__dirname, 'node_modules'),
      ]
    },

    // These rules tell Webpack how to process different module types.
    module: {
      rules: [
        {
          // all files that end in .js
          test: /\.js$/,
          use: [
            'babel-loader' //use 'babel-loader?compact=false'  // compact=false to suppress removing whitespaces
          ],
        }
      ]
    },

    plugins: [],

    devtool: "source-map"
  }
];
