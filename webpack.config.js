var path = require('path');
var webpack = require('webpack');

var src = 'src'
var dist = 'dist';
var entry = path.join(__dirname, src, 'index.js');

module.exports = {
  entry: [
    entry
  ],
  plugins: [],
  output: {
    path: path.join(__dirname, dist),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot-loader/webpack', 'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-3'],
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader'],
      exclude: /node_modules/
    }]
  }
};
