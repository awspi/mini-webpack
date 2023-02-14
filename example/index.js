import path, { dirname } from "path";
import { webpack } from "../src/index.js";
import { fileURLToPath } from "url";
import { jsonLoader } from './loader/json-loader.js'
import { changeOutputFilename } from './plugin/change-filename.js'
// file:///Users/wsp/Documents/Learn_webpack_vite_rollup/mini-webpack/example/index.js
// /Users/wsp/Documents/Learn_webpack_vite_rollup/mini-webpack/example/index.js
// /Users/wsp/Documents/Learn_webpack_vite_rollup/mini-webpack/example
const __dirname = dirname(fileURLToPath(import.meta.url));
const webpackConfig = {
  entry: path.join(__dirname, "./src/main.js"),
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [{
      test: /\.json$/,
      use: [jsonLoader]// 数组or单个函数
    }]
  },
  plugins: [new changeOutputFilename()]
};

webpack(webpackConfig);
