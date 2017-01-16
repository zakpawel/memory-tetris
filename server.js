var webpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var minilog = require('minilog');
var webpackConfig = require('./webpack.config.js');

minilog.enable(); // logs to stdout
var logger = minilog();

var IS_PRODUCTION = process.env.NODE_ENV === 'production'
var IS_DEVELOPMENT = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

if (IS_PRODUCTION) {
  logger('IN PRODUCTION');
  webpackConfig.plugins.push(
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
  var compiler = webpack(webpackConfig);
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
  var config = require('./config.json');
  logger(config);
  logger('IN DEVELOPMENT');
  webpackConfig.devtool = 'sourcemap';
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'IS_DEVELOPMENT': true
    })
  );
  webpackConfig.entry = [
    'react-hot-loader/patch',
    ...webpackConfig.entry,
    'webpack/hot/dev-server',
    `webpack-dev-server/client?http://${config.ADDRESS}:${config.PORT}`
  ];

  var compiler = webpack(webpackConfig);
  var server = new webpackDevServer(compiler, {
    hot: true,
    filename: webpackConfig.output.filename,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  });

  server.listen(config.PORT, config.ADDRESS, function() {});
}
