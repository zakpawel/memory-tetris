var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var root = path.resolve(__dirname, '..');
var src = path.resolve(root, 'src');
var entry = path.resolve(root, 'src', 'index.js');
var dist = path.resolve(root, 'build', 'production');
var buildFilename = 'build.js';

module.exports = {
  entry: [
    entry
  ],
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'index.production.html'),
      hash: true
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_console: true
      }
    })
  ],
  output: {
    path: dist,
    publicPath: '/',
    filename: buildFilename
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: [src]
    }, {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader'],
      include: [src]
    }]
  }
};
