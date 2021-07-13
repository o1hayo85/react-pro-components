## 0.1.14(抽取了 antd 主题---less 变量见组件库文档)

- 升级如果出现下面问题，请升级下包版本(yarn upgrade stylelint@13.12.0)

```
Unknown rule declaration-block-no-duplicate-custom-properties  declaration-block-no-duplicate-custom-properties
 1:1  ×  Unknown rule named-grid-areas-no-invalid                       named-grid-areas-no-invalid
```

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


## 0.1.25
  - 增加列拖拽保存
      - 现有设计原则：若新增列，删除列，将会还原列配置。
   ```js
     grid: {
       ...
        setColumnsDisplay: true;  // 是否允许设置列显隐 , 默认false，设为true允许显示列设置面板
        gridIdForColumnConfig: 'wmsReceiveOrderMainTable'; // 缓存到localstorage中的key,如果setColumnsDisplay为true，此配置必须配置，配置规则尽可能以ts__开头，避免与原js项目中的表格配置冲突
       ...
      }
   ```
   - 添加汇总行
     - 目前汇总有两种方式，一种和原js项目保持一致，另一种会在表格内的底部增加一条row数据。第二种方式适用于需要汇总大量字段使用
    ```js
     // 第一种
      grid: {
       ...
          sumColumns?: ['count', { key: 'count1', name: '可以自定义显示name'}];
          onSelectSum?: true; // 是否根据选择行汇总，设为false会汇总当前页信息
       ...
      }

      // 第二种
      grid: {
       ...
       columns: {
         key: 'totalNumber',
         name: '关闭状态',
         width: 100,
         summaryFormatter({ row }) {
          return (
            <strong>
              {row.totalNumber}
            </strong>
          );
         }
        }
        ...
       summaryRows: ['totalNumber'],;
  
      }
          
      ```
