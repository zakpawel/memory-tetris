var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var root = path.resolve(__dirname, '..');
var src = path.resolve(root, 'src');
var entry = path.resolve(root, 'src', 'index.js');
var dist = path.resolve(root, 'build', 'development');
var buildFilename = 'build.js';

module.exports = {
  entry: [
    'react-hot-loader/patch',
    entry,
    'webpack/hot/dev-server'
  ],
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'index.dev.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify("production")
      }
    })
  ],
  output: {
    path: dist,
    publicPath: '/',
    filename: buildFilename
  },
  devtool: 'sourcemap',
  devServer: {
    contentBase: path.join('build', 'development'),
    host: '0.0.0.0',
    port: 8080,
    publicPath: '/',
    filename: buildFilename,
    stats: {
      colors: true
    }
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot-loader/webpack', 'babel-loader'],
      include: [src]
    }, {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader'],
      include: [src]
    }]
  }
};
