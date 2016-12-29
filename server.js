var webpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var config = require('./webpack.config.js');

var compiler = webpack(config);
var server = new webpackDevServer(compiler, {
  hot: true,
  filename: config.output.filename,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
});

server.listen(8080, 'localhost', function() {});
