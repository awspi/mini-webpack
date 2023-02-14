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

  0: [function (require, module, exports) {
    "use strict";

var _foo = require("./foo.js");

// import doc from "./doc.md";
// import bar from './bar/index.js'
console.log("main"); // console.log(doc);

(0, _foo.foo)();
      },{"./foo.js":1}],
        
  1: [function (require, module, exports) {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

function foo() {
  console.log("foo");
}
      },{}],
        
          })
