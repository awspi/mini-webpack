// 传入原始资源（raw resource）内容
// 传出 JavaScript 和 source map（可选）

export const jsonLoader = function (source) {
  this.addDeps('jsonLoader ')
  console.log(source);
  return `export default ${JSON.stringify(source)}`
}
