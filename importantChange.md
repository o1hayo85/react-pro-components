## 0.4.10 新增 egenie-common 包。迁移 egenie-utils 包一些方法到 egenie-common

1. 设计函数、组件等(下面是具体迁移内容、ts 项目和 js 项目都可用)---request、BaseData, PaginationData, BatchReportData, PureData 暂时不受影响

```ts
export { formatNumber, add, subtract, multiple, toFixed, formatPrice, thousandthSeparator, objToDict } from './helper';
export type { DictData } from './helper';
export { request } from './request';
export type { BaseData, PaginationData, BatchReportData, PureData } from './request';
export { renderModal, destroyModal, destroyAllModal } from './renderModal';
export { Locale } from './locale';
export { RenderRoutes } from './renderRoutes';
export type { MenuDataItem } from './renderRoutes';
export { history } from './history';
export { printHelper, formatBarcodeData, printWayBill, CustomPrintModal, getCustomPrintParam, getSensitiveData } from './print';
```

2. ts 项目注意点----DictData、MenuDataItem 这个 2 个导出的类型现在需要如下引入。request、BaseData, PaginationData, BatchReportData, PureData 这些接口 2 个包都维护，建议后面从 egenie-common 引入。涉及类型引入的参考下面

```ts
import type { MenuDataItem } from 'egenie-common';
```

3. js 项目注意点

   - axios 引入方式(下面 2 选 1)

     - 直接下载依赖到 package.json
     - 通过 cdn 引入(建议)

       ```
       // 在项目的public/index.html的body标签下面添加下面内容
       <script type="text/javascript" src="https://front.runscm.com/customer-source/common/axios.min.js?v=0.21.0"></script>

       // 增加webpack的externals配置
       externals: {
         axios: {
           commonjs: 'axios',
           commonjs2: 'axios',
           amd: 'axios',
           root: 'axios',
         },
       }

       // 增加webpack的output的libraryTarget
       libraryTarget: 'umd'，
       ```

## v0.2.5 添加表格 tree

1. 增加列配置字段：treeExpand?:boolean;需要在哪一列添加展开折叠功能，就在哪一列配置。
2. 可自行对数据做处理，也可让后端直接返回。若通过点击展开按钮动态获取子表信息，则需要在表格的 api 里配置`onToggleOrDeleteSubRow`方法，在此方法里请求回来的数据再自行做处理。
3. `onToggleOrDeleteSubRow({id?: string | number, type: 'toggleSubRow' | 'deleteSubRow', primaryKeyField})`
4. `id`为点击行的`rowId`
5. `toggleSubRow`：点击了展开折叠按钮，`deleteSubRow`点击了子表删除按钮，通过此字段区分
6. `primaryKeyField`为表格配置的`primaryKeyField`字段
7. tree 对表格数据的限制：

- 必须有`children`字段
- children 的 key 要与主表的 key 字段一致。比如主表的主键是 wmsOrderId,children 里的每一项也要有 wmsOrderId 字段，暂不支持子表 key 自定义。
- children 的每一项必须要有`parentId`字段，parentId 的值要与上一层父表的 key 的值全等。
  > 示例：

```js
  {
    column: [
      {
        key: 'wmsReceiveOrderNo',
        name: '收货单编号',
        width: 200,
        sortable: true,
        treeExpand: true, // 这一列用来控制展开折叠
      },
    ],
    api: {
      // 从后端请求回来的分页数据一般为{ status: 'Successful', data: { list: [], ... } }
     onToggleOrDeleteSubRow: async({ id, type, primaryKeyField }) => {
      // 点击了展开折叠按钮，拿回来的数据就是点击的rowId对应的子表数据
      if (type === 'toggleSubRow') {
        const result = await request<PaginationData<IReveiveDataList>>({
          url: api.receiveOrder,
          method: 'POST',
          data: {
            page: 1,
            pageSize: 50,
            sidx: '',
            sord: '',
          },
        });
        const list = result.data.list;
        list.forEach((el, i) => {
          // 这里手动给子表的每一行强制加主键和父表的主键一致
          // parenId在组件库底层处理，这里无需处理
          el[primaryKeyField] = `${id}__${i}`;
        });
        result.data.list = list;
        return result;
      }
      // 点击了子表的删除按钮
      if (type === 'deleteSubRow') {
        // 调用删除接口操作
         const result = await request({...})
        // return true | false;
        // true, 删除成功
        // false 删除失败
       }
        return true;
      }
    }
  }

```

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
