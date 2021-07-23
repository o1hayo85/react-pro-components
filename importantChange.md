## 0.1.28(增加版本切换)

- 首先明白 oldUrl(老的 url 地址)、newUrl(新的 url 地址)、pageId(页面 id)
- 明白升级项目。新、老项目这是必须要增加切换版本的按钮。看此项目的首页到底是哪个项目(比如 ts-wms 首页是 erp-home 这个项目提供的，那么需要检查 erp-home)，该项目的 egenie-utils 版本至少 0.1.28

* 升级步骤

  - 升级新项目和页面项目(如果需要)的 egenie-util 版本
  - 找 iac(david)组,配置页面的 newUrl
  - 检查配置 newUrl 是否成功(找配置的环境的首页查看 api/iac/resource/dashboard/dock2 这个接口对应 id 的 newUrl 是否是你所要的)
  - 新老项目增加切换按钮(建议添加确认框,建议放在最右边)
  - 最核心点击事件的代码(点击事件自己写，弹框自己写)[接口 yap 地址说明](http://192.168.200.91:3000/project/29/interface/api/62443)

  ```js
  try {
    window.top.egenie.toggleVersion(resourceId, versionType);
  } catch (e) {
    console.log(e);
  }
  ```

  - 简单说明 resourceId 就是页面 id，versionType=1 切换为旧版本，versionType=2 切换为新版本
  - 简单例子(在新项目中切换为老版本)

```tsx
<Button
  onClick={() => {
    Modal.confirm({
      title: '确认切换到老版吗?',
      onOk: () => {
        try {
          window.top.egenie.toggleVersion(你的页面id, 1);
        } catch (e) {
          console.log(e);
        }
      },
    });
  }}
>
  切换版本
</Button>
```

- 简单例子(在老项目中切换为新版本)

```js
$('html中的元素').click(function () {
  msg.confirm({
    text: '确认切换新版吗?',
    onOk: function () {
      try {
        window.top.egenie.toggleVersion(你的页面id, 2);
      } catch (e) {
        console.log(e);
      }
    },
  });
});
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

  - 目前汇总有两种方式，一种和原 js 项目保持一致，另一种会在表格内的底部增加一条 row 数据。第二种方式适用于需要汇总大量字段使用
    ```js
    // 第一种
    grid: {
    ...
    sumColumns?: ['count', { key: 'count1', name: '可以自定义显示name'}];
    onSelectSum?: true; // 是否根据选择行汇总，设为false会汇总当前页信息
    ...
    }
    ```

  // 第二种 grid: { ... columns: { key: 'totalNumber', name: '关闭状态', width: 100, summaryFormatter({ row }) { return ( <strong> {row.totalNumber} </strong> ); } } ... summaryRows: ['totalNumber'],;

  }

  ```

  ```

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
