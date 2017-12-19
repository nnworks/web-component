const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: './src/html/web-component.html',

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

  // These rules tell Webpack how to process different module types.
  // Remember, *everything* is a module in Webpack. That includes
  // CSS, and (thanks to our loader) HTML.
  module: {
    rules: [
      {
        // If you see a file that ends in .html, send it to these loaders.
        test: /\.html$/,
        // This is an example of chained loaders in Webpack.
        // Chained loaders run last to first. So it will run
        // polymer-webpack-loader, and hand the output to
        // babel-loader. This let's us transpile JS in our `<script>` elements.
        use: [
          { loader: 'babel-loader' },
          { loader: 'polymer-webpack-loader' }
        ],
        // Exclude starting point of bundle
        exclude: /src\/html\/index\.html$/
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

    // This plugin will copy files over for us without transforming them.
    // That's important because the custom-elements-es5-adapter.js MUST
    // remain in ES2015.
    new CopyWebpackPlugin([
      {from: path.resolve(__dirname, 'bower_components/webcomponentsjs/*.js'), to: 'bower_components/webcomponentsjs/[name].[ext]'},
      {from: path.resolve(__dirname, 'src/js/webcomponents-helper.js'), to: 'src/js/webcomponents-helper.js'}
      ])
  ],

  devServer: {
    contentBase: path.join(__dirname, "./"),
    compress: true,
    port: 9000
  },

  devtool: "source-map"
};
