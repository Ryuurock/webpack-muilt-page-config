module.exports = {
  "globals": {
    "Qiniu": false,
    "QiniuJsSDK": false,
    "GoEasy": false,
    "process": false,
    "__dirname": false
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "impliedStrict": true,
      // 对扩展语句的支持
      experimentalObjectRestSpread: true
    }
  },
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "amd": true,
    "jquery": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "windows"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};
