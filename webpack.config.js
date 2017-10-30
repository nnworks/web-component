const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: './src/js/service.js',

  output: {
    filename: 'web-component.js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'bower_components')
    ]
  },

  module: {
    rules: [
      {
        // all html
        test: /\.html$/,
        // loaders chain: run last to first!
        use: [
          {loader: 'babel-loader'},
          {loader: 'polymer-webpack-loader'},
        ],
        //exclude: '',
      },
      {
        // If you see a file that ends in .js, just send it to the babel-loader.
        //test: /\.js$/,
        //use: [
        //  'babel-loader'
        //],
        //exclude: '',
        // Optionally exclude node_modules from transpilation except for polymer-webpack-loader:
        // exclude: /node_modules\/(?!polymer-webpack-loader\/).*/
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    template: './src/html/web-component.html',
    inject: 'body'
  })],

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },

  devtool: "source-map"


};

