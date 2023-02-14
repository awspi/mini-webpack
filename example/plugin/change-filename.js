// 插件:改变打包路径
export class changeOutputFilename {
  constructor(filename = "bundle.js") {
    this.filename = filename
  }
  apply(compiler) {
    compiler.hooks.emit.tap('changeOutputPath', (compiler) => {
      console.log('_______changeOutputPath')
      compiler._output.filename = this.filename
    })
  }
}
