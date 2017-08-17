/* eslint-disable */
var utils = require( './utils' );
var webpack = require( 'webpack' );
var config = require( './config' );
var merge = require( 'webpack-merge' );
var baseWebpackConfig = require( './webpack.base.cfg' );
var mapping = require( './mapping' );
/* var HtmlWebpackPlugin = require( 'html-webpack-plugin' ); */
var FriendlyErrorsPlugin = require( 'friendly-errors-webpack-plugin' );
var HtmlWebpackHarddiskPlugin = require( 'html-webpack-harddisk-plugin' );
var BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;

// add hot-reload related code to entry chunks
! function() {
  let entrys = {};

  Object.keys( baseWebpackConfig.entry ).forEach( function( name ) {
    // 直接修改为webpack-hot-middleware/client?reload=true，
    // 因为html是实时写入的所以就去掉html修改的自动刷新
    if ( !mapping[ name ].disable ) {
      entrys[ `${config.dev.entryPrefix}${name}` ] = [ /* './build/dev.client' */ 'webpack-hot-middleware/client?reload=true', baseWebpackConfig.entry[ name ] ];
    }
  } );
  baseWebpackConfig.entry = entrys;
}();

module.exports = merge( baseWebpackConfig, {
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  module: {
    rules: [ {
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader', 'postcss-loader' ]
    }, {
      test: /\.less$/,
      use: [ 'style-loader', 'css-loader', 'postcss-loader', 'less-loader' ]
    } ]
  },
  plugins: [
    new webpack.DefinePlugin( {
      'process.env': config.dev.env
    } ),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    ...utils.getHtmlWebpackPlugins( true ),
    new HtmlWebpackHarddiskPlugin(),
    new FriendlyErrorsPlugin(),
    // 依赖分析
    //new BundleAnalyzerPlugin()
  ],
  watchOptions: {
    ignored: /node_modules/
  }
} );
