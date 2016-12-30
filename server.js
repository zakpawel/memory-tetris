var webpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var minilog = require('minilog');
var config = require('./webpack.config.js');

minilog.enable(); // logs to stdout
var logger = minilog();

var IS_PRODUCTION = process.env.NODE_ENV === 'production'
var IS_DEVELOPMENT = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

if (IS_PRODUCTION) {
  logger('IN PRODUCTION');
  config.plugins.push(
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      'IS_PRODUCTION': true
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            screw_ie8: true
        }
    })
  );
  var compiler = webpack(config);
  compiler.run((err, stats) => logger(err, stats.toString({
    hash: true,
    version: true,
    timings: true,
    assets: true,
    chunks: true,
    modules: true,
    reasons: true,
    children: true,
    source: true,
    errors: true,
    errorDetails: true,
    warnings: false,
    publicPath: true,
    colors: true
  })));
} else if (IS_DEVELOPMENT) {
  logger('IN DEVELOPMENT');
  config.devtool = 'sourcemap';
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'IS_DEVELOPMENT': true
    })
  );
  config.entry = [
    'react-hot-loader/patch',
    ...config.entry,
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://192.168.1.121:8080'
  ];

  var compiler = webpack(config);
  var server = new webpackDevServer(compiler, {
    hot: true,
    filename: config.output.filename,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    }
  });

  server.listen(8080, '192.168.1.121', function() {});
}
