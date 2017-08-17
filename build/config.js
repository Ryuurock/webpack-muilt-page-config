// see http://vuejs-templates.github.io/webpack for documentation.
/* eslint-disable */
var path = require( 'path' )
let assetsSubDirectory = '__webpack_static';
let assetsPublicPath = 'Public';
let entryPrefix = '__webpack';
let port = 8088;
module.exports = {
  $d: 'Public/dev',
  build: {
    env: require( './prod.env' ),
    index: path.resolve( __dirname, '../Application/Home/View/Admin/index.html' ),
    assetsRoot: path.resolve( __dirname, `../${assetsPublicPath}/` ),
    // 静态文件提交目录
    assetsSubDirectory: `dist`,
    // 主目录的CDN  可直接配置成微知支持服务器
    //assetsPublicPath: `/${assetsPublicPath}/`,
    assetsPublicPath: 'http://example.com/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: [ 'js', 'css' ],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require( './dev.env' ),
    port: 8088,
    entryPrefix: `${entryPrefix}-`,
    autoOpenBrowser: true,
    assetsSubDirectory,
    assetsPublicPath: `/`,
    proxyTable: {
      '/': {
        target: 'http://localhost/',
        changeOrigin: true,
        filter( pathname, req ) {//|([0-9]+\\.js?$)
          return !new RegExp( `(^\/${entryPrefix}|${assetsSubDirectory})|(hot-update\\.js(on)?$)` ).test( pathname );
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}