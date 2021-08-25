---
title: 常用配置
order: 3
---

## babel 配置(建立 babel.config.js 文件)

```js
// 对antd按需引入
module.exports = require('egenie-babel-config')(true);

// 对antd-mobile按需引入
module.exports = require('egenie-babel-config')(false);
```

## postcss 配置(建立 postcss.config.js 文件)

```js
// rem 单位。配合 amfe-flexible 更佳
// 不需要rem布局填0
module.exports = require('egenie-config').postcss(0);
```
