/* eslint-disable */
let webpack = require( 'webpack' );
var path = require( 'path' );
var utils = require( './utils' );
var config = require( './config' );
var mapping = require( './mapping' );
var isProduction = process.env.NODE_ENV === 'production';


/* var ROOT = path.resolve( __dirname ); */
var $d = config.$d;
var BASE = `${$d}/js/`;
var BASE_MODULES = `${BASE}modules/`;
var BASE_LIBS = `${BASE}libs/`;

var entryPath = `./${BASE}`;

var node_modules = 'node_modules';

// =================
/* var OptimizeCSSPlugin = require( 'optimize-css-assets-webpack-plugin' )
var ExtractTextPlugin = require( 'extract-text-webpack-plugin' )
var HtmlWebpackPlugin = require( 'html-webpack-plugin' ) */

function resolve( dir ) {
  return path.join( __dirname, '..', dir );
}

function getEntrys() {
  let entrys = {};

  Object.keys( mapping ).forEach( entry => {
    // 入口文件，默认名为main.js
    entrys[ entry ] = `${entryPath}page/${entry}/${mapping[entry].file || 'main'}.js`;
  } );

  return entrys;
}
module.exports = {
  entry: getEntrys(),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    // cdn路径
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: [ '.js', '.vue', '.json' ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '$d': resolve( $d ),
      '$modules': resolve( `${$d}/js/modules` ),
      /* jq插件 （第三方） start */
      //============bootstrap==================
      'bootstrap': resolve( `${BASE_LIBS}bootstrap/bootstrap.js` ),
      'selector': resolve( `${node_modules}/bootstrap-select` ),
      // ================bootstrap=========================
      'artCategoryHandle': resolve( `${BASE_MODULES}artCategoryHandle` )
      // 这里应该有更多配置
    }
  },
  module: {
    rules: [ {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: utils.cssLoaders( {
          sourceMap: isProduction ?
            config.build.productionSourceMap : config.dev.cssSourceMap,
          extract: isProduction
        } )
      }
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath( 'img/[name].[hash:7].[ext]' )
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath( 'fonts/[name].[hash:7].[ext]' )
      }
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /iview.src.*?js$/,
      loader: 'babel-loader'
    }, {
      // 导出$到全局变量里
      test: require.resolve( 'jquery' ),
      use: [ {
        loader: 'expose-loader',
        options: '$'
      } ]
    } ]
  },
  plugins: [
    new webpack.ProvidePlugin( {
      jQuery: 'jquery',
      $: 'jquery'
    } )
  ]
};
