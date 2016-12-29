var path = require('path');
var webpack = require('webpack');

var src = 'src'
var dist = 'dist';
var entry = path.join(__dirname, src, 'index.js');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    entry,
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080'
  ],
  devtool: 'sourcemap',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    path: path.join(__dirname, dist),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot-loader/webpack', 'babel-loader?presets[]=react,presets[]=es2015'],
      exclude: /node_modules/
      // include: path.join(__dirname, src)
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }]
  }
};
