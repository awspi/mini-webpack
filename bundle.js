(function (modules) {
  // require的作用就是帮你去调用导出模块的export函数
  function require(id) {
    // 通过 id 找到对应的模块函数
    const [fn, mapping] = modules[id]//!
    const module = { exports: {} }
    // filePath-->id
    function localRequire(filePath) {
      const id = mapping[filePath]
      return require(id)
    }
    fn(localRequire, module, module.exports)

    return module.exports
  }
  require(0)
})({
  1: [
    function (require, module, exports) {
      const { foo } = require('./foo.js')
      console.log('main');
      foo()
    },
    { './foo.js': 2 }
  ],
  2: [
    function (require, module, exports) {
      exports.foo = function () {
        console.log('foo');
      }
    },
    {}
  ]
})
