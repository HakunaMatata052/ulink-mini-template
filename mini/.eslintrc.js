module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  // 'extends': 'eslint:recommended',
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  globals: {
    wx: true,
    App: true,
    Page: true,
    getCurrentPages: true,
    getApp: true,
    Component: true,
    requirePlugin: true,
    requireMiniProgram: true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        singleQuote: true,
        semi: false,
        trailingComma: 'es5',
        bracketSpacing: true,
        jsxBracketSameLine: false,
        arrowParens: 'avoid',
      },
    ],
    semi: [2, 'never'], // 语句强制分号结尾
    'no-irregular-whitespace': 2, // 不能有不规则的空格
    'no-multiple-empty-lines': [1, { max: 0 }], // 空行最多不能超过1行
    'no-multi-spaces': 1, // 不能用多余的空格
    'no-mixed-spaces-and-tabs': [2, false], // 禁止混用tab和空格
    // 'no-regex-spaces': 2,// 禁止在正则表达式字面量中使用多个空格 /foo bar/
    'no-spaced-func': 2, // 函数调用时 函数名与()之间不能有空格
    'no-sparse-arrays': 2, // 禁止稀疏数组， [1,,2]
    'no-trailing-spaces': 1, // 一行结束后面不要有空格
    'no-useless-escape': 0,
    // 'camelcase': 2,// 强制驼峰法命名
  },
}
