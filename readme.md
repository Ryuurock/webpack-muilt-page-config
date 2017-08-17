`webpack`的流行给前端开发减少了许多不必要的工作，`webpack`可以让我们更纯粹的关注我们的代码，但是很多人认为它更适合单页应用，主要有以下一些痛点

* 如果模板是后台管理的生成的怎么办
* 我目前没有使用任何模块化的开发方式，或使用了模块加载器（如`seajs`、`requireJs`等）

其实第二点我已经在上篇文章中讲过了，如果平滑的过渡到`webpack`，痛点一也解释过，只是没有详细的说明，此次分享一个完整的配置，来应对你的多页项目。不管是`jsp`、`php`、`html`、`xshtml`都可以通过具体的配置来使用`webpack`，为什么如此青睐`webpack`，在我看来热**更新技术**、`less`、`sass`、`es6`、`es7`的引入是最吸引我的（尝试过使用`gulp`、但是感觉并没有`webpack`这种一站式服务来得顺手），下面我详细讲述下下面一些配置的用途，部分代码来自[vue-cli](https://github.com/vuejs/vue-cli)。

```
├─build                 // webpack的配置文件存放目录
├─Public                // 我们的前端资源存放目录
│  ├─dev                // 源码存放目录（可以改名为src）
│  │  ├─css             // 一些共用的css文件，共用才放这里哦
│  │  ├─font            // 字体文件
│  │  ├─images          // 图片文件
│  │  └─js              // js文件
│  │      ├─libs        // npm里没有的第三方插件或库
│  │      ├─modules     // 项目的业务组件存放目录
│  │      └─page        // 页面的目录
│  │          └─Index   // 具体的页面名称
│  └─dist               // 编译后的存放目录
└─static                // 好像是拿来缓存文件用的？vue-cli存在的
```
当然，我目前开发的项目是半路引入`webpack`的，大部分都还是`jQuery`那套东西、但是我还是秉着**关注点分离**的原则，将`html`、`css`、`js`按页面来放了，不再使用老掉牙的按文件类型来放、那是因为有了`webpack`的打包才可以这么随意。除了分离出来的模板（`ThinkPHP`用`<include file=""/>`标签来引入模板）文件，js和css都是放到同模板名的Public/dev/js/modules目录里了，这样一来可以直接像这样
```javascript
require( './style.less' );
...
```
先在js文件的头部引入这个组件的样式文件，再来写js代码，至少我们在使用组件的时候不必关心css了（下篇文章会讲讲重构后如何连html也不关注了）

#### images
这里为什么会有一个`images`目录看起来很多余呢，那是因为我们的php模板里的图片标签`src`前面都带了一个`php`的系统变量，`webpack`插件的静态分析是无法识别这里的路径的，所以保留了这个目录，在打包后用插件拷贝到打包目录里

#### page
然后是`page`这个目录，这个目录是拿来存放我们页面的三剑客的，比如有一个叫`index`的目录，里面有`css`、`js`、`html`文件，这里的`index`可以看作是一个页面目录，也可以看作是一个分类，如果是分类，那下面就应该是页面了，html里不应该引用`css`文件和`js`文件，因为webpack会帮我们插入生成新的html到我们指定的目录里

最重要的就是`build`目录下的了

#### config.js
`proxyTable`项我已经在上篇文章中讲过了，这里就不赘述了

#### mapping.js
这个文件就是描述我们`entry`也就是入口文件和html模板之间的关系映射的文件的

```javascript
module.exports = {
  // 微知首页
  'Index': {
    // 对应到Public/dev/js/page的文件夹名称
    file: 'main',
    // 视图层的文件名称，默认为index
    viewFile: 'index',
    disable: false,
    templateOutput: 'Index'
  },
  'EditText': {
    chunks: [ 'editor' ],
    disable: false
  },
  // 编辑模板
  'Template': {
    chunks: [ 'editor' ],
    disable: true
  },
  // 默认模板
  'GzhArtStyle': {
    chunks: [ 'editor' ],
    disable: true
  }
};
```
这里导出的每个对象的键值都对应了`page`目录里的名字，下面的`file`字段对应的入口js文件名称，默认为`main`，`viewFile`对应的是html模板名称，默认为`index`，这里很有用，因为在`ThinkPHP`的`View`目录里模板部分文件夹的，所以我们配合`templateOutput`把html输出过去就不存在目录了，`templateOutput`的默认值为这个对象的键值如Index默认为Index。`disable`字段是开发模式使用的，当运行`npm run dev`命令时会自动扫描这个字段，若为`false`才会启动，如果全部都为false，那么你页面越多造成性能开销就越大，所以除非你同时去开发几个页面，这里建议启动的页面不超过5个，其他页面若要运行，提前`npm run build`一次让它跑编译后的代码就好了。`chunks`字段是用来标记当前页面依赖的除了共有`chunks`需要依赖的其他`chunks`，上面的有chunks字段的三个页面都是引用了百度编辑器，因为百度编辑器的包都太大了，所以不建议抽取到公用的chunk里，这里的配置在`webpack.prod.cfg.js`文件里有单独配置。
#### utils.js
这个文件主要是`getHtmlWebpackPlugins`方法，配合注释您就能看懂刚才的mapping配置都怎么用的了
```javascript
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
        // 如果是其他目录在此修改路径
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
```
`alwaysWriteToDisk`这个字段是我们能前后端结合开发的关键，没有使用后端模板的项目真的做到前后分离时是不需要这个字段的，因为PHP会读这个文件再渲染数据出来给浏览器

#### webpack.base.cfg.js、webpack.dev.cfg.js
都是些老生常谈的配置，这里就不赘述了。值得注意的是`dev.client.js`这个文件被我删了，因为使用了`alwaysWriteToDisk`实时写入的功能，改变css文件和js文件都会强制刷新，那热更新完全就没法用了，所以html文件的变化还是需要手动刷新的

#### webpack.prod.cfg.js
`HtmlWebpackPlugin`这个插件确实是有多少页面就要插入多少个实例进去的，所以直接
```javascript
...utils.getHtmlWebpackPlugins( false ),
```
展开这个数组就好了，这里传入的布尔参数是为了区分开发模式和build模式，传入`true`只会有一个chunk被包含进来，就是当前页面依赖的所有js和css等
然后是`chunks`
##### manifest
有的页面因为太简单并没有依赖太多共用的js，但是依赖了共用的css，所以这个chunk仅仅是为了抽取css文件用，造成引用了一个空的js，暂时没有想到好的解决办法，欢迎再issues提出改进建议

##### vendor.modules
这个chunk是为了抽取我们自己写的业务组件、在修改业务组件后能够很好的利用缓存只更新这一个文件

##### commonChunk
上文`mapping`里的chunks字段就是这里配置的，如果还有其他局部共用的大chunk可以在这里再配置一个
##### vendor
vendor就是拿来放置第三方插件的，这里抽取了npm和lib里面的，当项目稳定后处于一个稳定的维护期，没有较大改动时，这个文件就可以长期缓存在用户的电脑里了。

```javascript
new CopyWebpackPlugin( [ {
  from: path.resolve( __dirname, `../${config.$d}/images` ),
  to: `${config.build.assetsSubDirectory}/images`,
  ignore: [ '.*' ]
} ] ),
```
上面的代码就是拷贝images这个目录到我们打包生成的目录里，防止资源丢失的问题
***
这个脚手架很可能无法直接运行在你的项目里，但是能为你的多页入口的`website`提供一个很好的引入`webpack`的思路

have fun ~~