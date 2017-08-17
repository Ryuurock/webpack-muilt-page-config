/* eslint-disable */
var path = require( 'path' )
var merge = require( 'webpack-merge' )
var utils = require( './utils' )
var config = require( './config' )
var webpack = require( 'webpack' )
var ExtractTextPlugin = require( 'extract-text-webpack-plugin' )
var CopyWebpackPlugin = require( 'copy-webpack-plugin' )
var baseWebpackConfig = require( './webpack.base.cfg' )
var OptimizeCSSPlugin = require( 'optimize-css-assets-webpack-plugin' )
var FastUglifyJsPlugin = require( 'fast-uglifyjs-plugin' );
var os = require( 'os' );

var mapping = require( './mapping' );

var env = config.build.env;

var webpackConfig = merge( baseWebpackConfig, {
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath( 'js/[name].[chunkhash:6].js' ),
    chunkFilename: utils.assetsPath( 'js/[id].[chunkhash:6].js' )
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  module: {
    rules: [ {
      test: /\.css$/,
      use: ExtractTextPlugin.extract( {
        fallback: "style-loader",
        use: [ "css-loader", "postcss-loader" ]
      } )
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract( {
        fallback: "style-loader",
        use: [ 'css-loader', "postcss-loader", "less-loader" ]
      } )
    } ]
  },
  plugins: [
    new webpack.DefinePlugin( {
      'process.env': env
    } ),
    // 快速压缩(带缓存的)插件
    new FastUglifyJsPlugin( {
      compress: {
        warnings: false
      },
      // debug设为true可输出详细缓存使用信息:
      debug: true,
      // 默认开启缓存，提高uglify效率，关闭请使用:
      //cache: false,
      // 默认缓存路径为项目根目录，手动配置请使用:
      //cacheFolder: path.resolve( __dirname, '.otherFolder' ),
      // 工作进程数，默认os.cpus().length
      //workerNum: os.cpus().length
      workerNum: 2
    } ),
    // 自带的压缩
    /* new webpack.optimize.UglifyJsPlugin( {
      compress: {
        warnings: false,
        drop_debugger: true,
      },
      sourceMap: true,
      output: {
        ascii_only: true
      }
    } ), */

    // extract css into its own file
    ...utils.getHtmlWebpackPlugins( false ),
    new OptimizeCSSPlugin( {
      cssProcessorOptions: {
        safe: true
      }
    } ),
    // 公共的 chunk
    // 因为之前我每个页面引用了一个固定的less  所以这里只是为了抽取共用的css文件
    new webpack.optimize.CommonsChunkPlugin( {
      name: 'manifest',
    } ),
    // 自定义的业务模块chunk抽取到一个文件里
    new webpack.optimize.CommonsChunkPlugin( {
      name: 'vendor.modules',
      chunks: [ 'manifest', ...Object.keys( mapping ) ],
      minChunks( module, count ) {
        return (
          module.resource &&
          /\.js$/.test( module.resource ) &&
          module.resource.indexOf(
            path.join( __dirname, `../${config.$d}/js/modules` )
          ) === 0
        )
      }
    } ),
    // 分别抽取模块，文件如果很大就很有必要
    new webpack.optimize.CommonsChunkPlugin( {
      name: 'commonChunk',
      chunks: [ 'Template', 'EditText', 'GzhArtStyle' ]
    } ),
    // 抽取依赖的node模块和第三方插件chunk
    new webpack.optimize.CommonsChunkPlugin( {
      name: 'vendor',
      chunks: [ 'manifest', ...Object.keys( mapping ) ],
      minChunks: function( module, count ) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test( module.resource ) &&
          ( module.resource.indexOf(
              path.join( __dirname, '../node_modules' )
            ) === 0 ||
            module.resource.indexOf(
              path.join( __dirname, `../${config.$d}/js/libs` )
            ) === 0 )
        )
      }
    } ),
    // copy custom static assets
    new CopyWebpackPlugin( [ {
      from: path.resolve( __dirname, '../static' ),
      to: config.build.assetsSubDirectory,
      ignore: [ '.*' ]
    } ] ),
    // 拷贝所有图片文件到images目录，防止动态图片404
    new CopyWebpackPlugin( [ {
      from: path.resolve( __dirname, `../${config.$d}/images` ),
      to: `${config.build.assetsSubDirectory}/images`,
      ignore: [ '.*' ]
    } ] ),
    new ExtractTextPlugin( {
      filename: utils.assetsPath( 'css/[name].[contenthash:6].css' ),
      allChunks: true
    } )
  ]
} );

module.exports = webpackConfig
