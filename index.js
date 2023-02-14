import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import { transformFromAst } from 'babel-core'

let id = 0

function createAsset(filePath) {
  //? 1. 获取文件内容
  const source = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  })
  //? 2. 获取依赖关系 --AST 使用babel 
  const ast = parser.parse(source, { sourceType: "module" })
  const deps = [] // 依赖关系
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value)
    }
  })
  // 转为CJS代码
  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  })

  return {
    filePath,
    code,
    deps,
    mapping: {},
    id: id++
  }
}

function createGraph() {
  const mainAsset = createAsset('./example/main.js')
  // 遍历图 BFS
  const queue = [mainAsset]
  //todo 可能重复需要set 加一个已完成set防止循环引用
  for (const asset of queue) {
    asset.deps.forEach(relativePath => {
      const child = createAsset(path.resolve('./example', relativePath))
      asset.mapping[relativePath] = child.id
      queue.push(child)
    })
  }
  return queue
}


function build(graph) {
  const template = fs.readFileSync('./bundle.ejs', { encoding: 'utf-8' })

  const data = graph.map(({ id, code, mapping }) => ({ id, code, mapping }))
  console.log(data);
  const code = ejs.render(template, { data })
  fs.writeFileSync('./dist/bundle.js', code)

}

const graph = createGraph()
build(graph)

//! 

// const mdLoader = function () {

// }

// const webpackConfig = {
//   entry: "./example/main.js",
//   module: {
//     rule: [{
//       test: /\.md$/,
//       use: mdLoader
//     }]
//   }
// }

// function webpack(config) {
//   globalConfig = config
//   const graph = createGraph()
//   bundle(graph)
// }

// webpack(webpackConfig)

