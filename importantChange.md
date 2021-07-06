## 0.1.14(抽取了 antd 主题---less 变量见组件库文档)

- 升级步骤

- 第一步更新包

```shell
yarn upgrade egenie-utils egenie-config --latest
```

- 第二步更新 config/config.js 文件

```shell
# 将less下面的theme的值替换为require('egenie-config/lib/theme/index.js')()
```

- 第三步更新 src/global.less 文件

```less
/* 云仓原来内容 */
@import '~antd/lib/style/themes/default.less';

html,
body,
#root {
  height: 100%;
}

.ant-modal-content {
  border-radius: 6px !important;
}

.ant-popover-title {
  border-bottom: none !important;
}

.ant-layout-sider {
  border-radius: 2px;
  box-shadow: 2px 2px 5px 0 rgba(230 225 225 0.5) !important;
}

canvas {
  display: block;
}

body {
  background: #f2f3f4 !important;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.ghost-bg-btn {
  color: @primary-color !important;
  background: rgba(25, 120, 255, 0.05) !important;
  border-color: @primary-color !important;
}

ul,
ol {
  list-style: none;
}

/* 新的内容---项目自己定义的全局样式不用删除 */
@import '~egenie-config/lib/theme/theme.less';
```
