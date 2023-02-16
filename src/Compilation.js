import { parse } from "./parser.js";
import path from "path";
import fs from "fs";

let ID = 0;
export default class Compilation {
  constructor({ loaders, entry }) {
    this._loaders = loaders || [];
    this._entry = entry; // 入口
    this.graph = [];// 图
    this.loaderContext = {
      addDeps(dep) {
        console.log('addDeps', dep);
      }
    }// loader的上下文
  }

  make() {
    const self = this;
    //? 构建模块
    function _buildModule(filename) {
      //? 1. 获取模块的代码内容
      let sourceCode = fs.readFileSync(filename, { encoding: "utf-8" });
      //* 需要在这里调用 loader
      // 把 sourceCode 给到 loader 做处理
      self._loaders.forEach(({ test: rule, use }) => {
        // 先看看这个 filename 是不是符合这个loader
        if (rule.test(filename)) {
          Array.isArray(use)
            ? use.reverse().forEach(fn => sourceCode = fn.call(self.loaderContext, sourceCode))//'use' 倒序执行
            : sourceCode = use.call(self.loaderContext, sourceCode)
        }

      });

      //? 2. 获取模块的依赖关系并把 import 替换成 require
      const { code, dependencies } = parse(sourceCode);

      return {
        code,
        dependencies,
        filename,
        mapping: {},
        id: ID++,
      };
    }

    //? BFS
    // 通过队列的方式来把所有的文件都处理掉
    //todo 可能重复需要set 加一个已完成set防止循环引用
    const moduleQueue = [];
    const entryModule = _buildModule(this._entry);
    moduleQueue.push(entryModule);
    this.graph.push(entryModule);

    while (moduleQueue.length > 0) {
      const currentModule = moduleQueue.shift();
      currentModule.dependencies.forEach((dependence) => {
        // 提前处理下 dependence 的路径
        // 需要完整的文件路径
        const childPath = path.resolve(
          path.dirname(currentModule.filename),
          dependence
        );
        const childModule = _buildModule(childPath);
        // mapping 的  key  需要是相对路径
        currentModule.mapping[dependence] = childModule.id;
        moduleQueue.push(childModule);
        this.graph.push(childModule);
      });
    }
  }
}
