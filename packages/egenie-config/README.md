## 对 babel 配置的封装.UI 主要是 antd、antd-mobile

```
// 对antd按需引入
module.exports = require('egenie-babel-config')(true);

// 对antd-mobile按需引入
module.exports = require('egenie-babel-config')(false);

```

## 对 postcss 配置的封装

```

// 建立postcss.config.js文件
// rem 单位。配合 amfe-flexible 更佳
// 不需要rem布局填0
module.exports = require('egenie-config').postcss(0);

```
