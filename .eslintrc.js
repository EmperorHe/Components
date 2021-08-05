module.exports = {
  // 默认情况下，ESLint 会在所有父级目录里寻找配置文件，一直到根目录。如果发现配置文件中有 “root”: true，它就会停止在父级目录中寻找。
  root: true,
  parserOptions: {
    parser: 'babel-eslint', // 解析器，默认使用Espree
    ecmaVersion: 6, // 支持es6语法，但并不意味着同时支持新的 ES6 全局变量或类型（比如 Set 等新类型）
    sourceType: 'module', // 指定来源的类型，"script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)
    // 使用的额外的语言特性
    ecmaFeatures: {
      jsx: true, // 启用 JSX
      globalReturn: true, // 允许在全局作用域下使用 return 语句
      impliedStrict: true, // 启用全局 strict mode (如果 ecmaVersion 是 5 或更高)
      experimentalObjectRestSpread: true // 启用实验性的 object rest/spread properties 支持。(重要：这是一个实验性的功能,在未来可能会有明显改变。 建议你写的规则 不要 依赖该功能，除非当它发生改变时你愿意承担维护成本。)
    }
  },
  env: {
    es6: true, // 启用 ES6 语法支持以及新的 ES6 全局变量或类型
    node: true, // Node.js 全局变量和 Node.js 作用域
    browser: true, // 浏览器全局变量
    jquery: true // jQuery 全局变量
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'], // '@vue/prettier'
  // * 配置规则 * （重要）
  rules: {
    indent: ['error', 2],
    'no-debugger': 0
  }
}
