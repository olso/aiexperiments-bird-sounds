module.exports = {
  env: {
    browser: true,
    commonjs: true,
    shelljs: true,
    node: true
  },
  extends: [
    "eslint:recommended"
  ],
  plugins: [
    "import"
  ],
  rules: {
    "import/no-unresolved": [2, {commonjs: true, amd: true}],
    indent: ["error", "tab"],
    "linebreak-style": ["error", "unix"],
    "no-process-env": 0,
    quotes: ["error", "double"],
    semi: ["error", "always"]
  }
};
