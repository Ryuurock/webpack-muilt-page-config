/**
 * 对象的键对应了Public/dev/js/page下面的目录名称和Application/Home/View下面的目录名称
 * 默认为一个页面对应一个目录，但是不排除一些一个目录多个页面的，这时候需要单独曾加一个templateOutput字段
 * 用来指定输出的view下面的目录，否则会直接输出到键对应的目录下面去
 */
module.exports = {
  // 微知首页
  'Index': {
    // 对应到Public/dev/js/page的文件夹名称
    file: 'main',
    // 视图层的文件名称，默认为index
    viewFile: 'index',
    disable: false
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
