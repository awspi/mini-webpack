// 插件:改变打包路径
export class changeOutputPath {
  apply(hooks) {
    hooks.emitFile.tap('changeOutputPath', (context) => {
      console.log('_______changeOutputPath')
      context.changeOutputPath('./dist/bundle-new.js')
    })
  }
}
