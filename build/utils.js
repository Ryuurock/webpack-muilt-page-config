/* eslint-disable */
var path = require( 'path' )
var ROOT = path.resolve( __dirname, '..' )
var config = require( './config' )
var ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
var mapping = require( './mapping' );
var HtmlWebpackPlugin = require( 'html-webpack-plugin' )

exports.assetsPath = function( _path ) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory
  return path.posix.join( assetsSubDirectory, _path )
}

exports.getHtmlWebpackPlugins = ( rename ) => {
  let HtmlWebpackPlugins = [];
  Object.keys( mapping ).forEach( function( name ) {
    // 如果不是开发环境 就全部打包
    // 如果是开发环境 就根据disable来进行打包
    ( process.env.NODE_ENV !== 'development' ||
      !mapping[ name ].disable ) &&
    HtmlWebpackPlugins.push(
      new HtmlWebpackPlugin( {
        alwaysWriteToDisk: true,
        // php端使用到的模板
        filename: `${ROOT}/Application/Home/View/${mapping[ name ].templateOutput ? mapping[ name ].templateOutput : name}/${mapping[name].viewFile || 'index'}.html`,
        // 插件用的模板文件
        template: `${ROOT}/${config.$d}/js/page/${name}/${mapping[name].viewFile || 'index'}.${mapping[name].templateType || 'html'}`,
        chunks: ( function() {
          if ( !rename ) {
            //let chunks = [ 'vendor.npm', 'vendor.TP', 'manifest', 'vendor.modules' ];
            let chunks = [ 'vendor.modules', 'vendor', 'manifest' ];
            if ( mapping[ name ].chunks ) {
              chunks = chunks.concat( mapping[ name ].chunks );
            }
            return chunks;
          }
          return [];
        }() ).concat( [ `${rename ? config.dev.entryPrefix : ''}${name}` ] ),
        // 手工排序
        chunksSortMode: 'manual',
        inject: true,
        showErrors: false
      } ) );
  } );
  return HtmlWebpackPlugins;
}

exports.cssLoaders = function( options ) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders( loader, loaderOptions ) {
    var loaders = [ cssLoader ]
    if ( loader ) {
      loaders.push( {
        loader: loader + '-loader',
        options: Object.assign( {}, loaderOptions, {
          sourceMap: options.sourceMap
        } )
      } )
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if ( options.extract ) {
      return ExtractTextPlugin.extract( {
        use: loaders,
        fallback: 'vue-style-loader'
      } )
    } else {
      return [ 'vue-style-loader' ].concat( loaders )
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders( 'less' ),
    sass: generateLoaders( 'sass', {
      indentedSyntax: true
    } ),
    scss: generateLoaders( 'sass' ),
    stylus: generateLoaders( 'stylus' ),
    styl: generateLoaders( 'stylus' )
  }
}
