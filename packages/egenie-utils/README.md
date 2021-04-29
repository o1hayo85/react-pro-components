## 文档生成(如果报错，去掉 rm -rf ./docs。手动删除，再运行)

```
npm run doc
打开docs下的index.html
```

## lint 工具说明

- 目的：尽可能减少团队代码风格差异
- 注意 prettier，别混用。先用 ide 自带的格式化，再以自动保存格式化。基本没什么错误。出错请对照下面插件找相关原因。如果是第三方插件的错误，看情况忽略错误
- eslint
  - [eslint 官方](https://cn.eslint.org/docs/rules/)主要是官方推荐、及可修复
  - [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)主要是官方推荐、及可修复
  - [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin) 主要是官方推荐、及可修复
- stylelint
  - [styleLint](https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules/list.md) 主要是官方推荐、及可修复
  - [styleLintStandard](https://github.com/stylelint/stylelint-config-standard) 主要是官方推荐、及可修复
- commitLint
  - [commitLint](https://github.com/conventional-changelog/commitlint#benefits-using-commitlint) 里面有相关提交类型的说明
  - [commitlint-config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)
  - [cz](https://github.com/commitizen/cz-cli) git commit 辅助工具，一般只需要前三步。比如： feat(需求号): 描述 feat 对应第一步类型，需求号对应第二步，描述对应第三步

## 一些扯淡

- 注意文件名大小写问题。case-sensitive-paths-webpack-plugin 算是解决方案。推荐文件名小写开头
- 不要用 webpack 的 alias 和 tsconfig.json 自定义的 path。有可能导致点击代码跳不到代码引用对应位置(特别是 js 项目)
- 不要直接就想用 any 解决问题
- mobx 尽量用装饰器。直观
- 除了路由入口组件不要用 export default
  - tree shaking 无法优化
  - [别人解释](https://jkchao.github.io/typescript-book-chinese/tips/avoidExportDefault.html#%E5%8F%AF%E5%8F%91%E7%8E%B0%E6%80%A7%E5%B7%AE)
  - 重构困难
  - typedoc 导出来的名称为 default
- ts 相关文档
  - [深入理解 ts](https://jkchao.github.io/typescript-book-chinese/)
  - [官方](https://www.tslang.cn/docs/home.html)
  - [react 项目](https://react-typescript-cheatsheet.netlify.app/docs/basic/setup/)
- [编程小技巧](http://www.yinwang.org/blog-cn/2015/11/21/programming-philosophy)
- [重构改善既有代码的设计第 2 版](https://pan.baidu.com/s/1TCJ0_vMoOmEb_ZitDDT8eg) 密码: fikq

## 换行符说明(windows)

```
// 提交时验证
# 拒绝提交包含混合换行符的文件
git config --global core.safecrlf true

# 允许提交包含混合换行符的文件
git config --global core.safecrlf false

# 提交包含混合换行符的文件时给出警告
git config --global core.safecrlf warn

// 下拉提交时操作
# 提交时转换为LF，检出时转换为CRLF
git config --global core.autocrlf true

# 提交时转换为LF，检出时不转换
git config --global core.autocrlf input

# 提交检出均不转换
git config --global core.autocrlf false

# 参考配置
git config --global core.safecrlf false
git config --global core.autocrlf input

```

## cli 外放配置说明。

- 在项目目录下建立 config/config.js

```
// utils为内部的一些配置
module.exports = function(utils) {
  return {
    less: {
      // 重写less变量
      theme: {},

      // 额外需要开启 cssModule
      moduleInclude: [],
    },
    babel: {
      // babel-loader 额外的 options
      options: [],

      // babel-loader 额外的 include
      include: [],
    },

    // 重写的 webpack 配置。内部调用 webpack-merge 合并
    otherConfig: {},
  };
};
```

## 环境变量

1. 在项目配置相关文件。参考 dotenv。下面为常用

```
.env.development
.env.production
.env.development.local
.env.production.local
```

2. 通过 cross-env。./node_modules/.bin/cross-env 你的 key=你的 value npm 脚本

3. 具体说明

- PUBLIC_URL
  - 静态资源前缀
  - 建议通过 cross-env 配合 shell 脚本打包
- IMAGE_INLINE_SIZE_LIMIT
  - 图片 inline 大小
- PORT
  - 启动端口
- SPLIT_CHUNK_MIN_SIZE
  - 分包的最小尺寸
- MOCK
  - 是否启用 mock 数据功能
  - YES 开启
- SERVICE_WORKER
  - 是否打包生成 serviceWorker 文件。注册请自写
  - YES 开启
- SOURCEMAP
  - sourcemap 方式
- ALLOW_ESLINT
  - 是否开启 eslint
  - NO 不开启
- IS_ANALYZE
  - 是否开启打包大小分析
  - YES 开启
- USE_ESBUILD
  - 是否使用 EsBuild
  - YES 开启
- REM_UNIT
  - 移动端 rem 单位。一般为 75。
  - 配合 amfe-flexible 更佳
  - 有单位则开启 postcss-px2rem。否则不开启

## 创建查询方案

```
import { observer } from 'mobx-react';
import React from 'react';
import { Programme, ProgrammeComponent } from '../../utils';

@observer
export default class extends React.Component {
  programme = new Programme({
    gridModel: {
      primaryKeyField: 'a',
      columns: [],
      api: { onQuery: () => Promise.resolve() },
    },
    fieldMap: {
      courier: 'courier_id-4-14',
      shop: 'shop_id-4-10',
      pay_type: 'pay_type-4-1',
    },
    filterItems: [
      {
        type: 'date',
        field: 'date',
        label: '日期类型',
        selectValue: 'sale_order_status.pay_time',
        data: [
          {
            value: 'sale_order_status.pay_time',
            label: '付款时间',
          },
        ],
      },
      {
        type: 'radio',
        label: '单号',
        field: 'radio',
        data: [
          {
            value: 'sale_order_no-14-10',
            label: '订单号',
            showInput: true
          },
          {
            value: 'platform_order_code-15-10',
            label: '平台单号',
          },
        ],
      },
      {
        type: 'radio',
        label: '审核',
        field: 'is_checked-3-1',
        value: '',
        data: [
          {
            value: '',
            label: '全部',
          },
          {
            value: 'true',
            label: '已审核',
          },
          {
            value: 'false',
            label: '未审核',
          },
        ],
      },
      {
        type: 'checkbox',
        label: '快递公司',
        field: 'courier_id-4-14',
        data: [],
      },
      {
        type: 'select',
        label: '支付方式',
        field: 'pay_type-4-1',
      },
      {
        type: 'select',
        mode: 'multiple',
        label: '店铺',
        field: 'shop_id-4-10',
        data: [],
      },
      {
        type: 'input',
        field: 'receiver_name-14-12',
        label: '收货人',
      },
      {
        type: 'inputNumberGroup',
        field: 'total_num-2-10',
        label: '宝贝数量',
      },
    ],
    moduleName: 'OMSOrders',
    dictList: 'order_type,blacklist_type,purchase_state_type,courier_print_mark_state,sku_purchase_state_type,origin_type,pay_type,cn_service,trade_from,system_order_state',
    itemList: 'shop,warehouse,dts_status_adapter,courier,wms_order_state',
  });

  render() {
    return <ProgrammeComponent store={this.programme}/>;
  }
}

```

- gridModel 为表格参数，详见表格文档
- moduleName 为查询方案标识，必须
- dictList、itemList 为 getConfig 接口参数，可选。fieldMap 返回 key 和 field 的映射
- filterItems 为初始化的查询项配置。type、field、label 必须。详见 item 的说明文档
- radio。data 加参数 showInput 字段可以变为原来的 mixedInput
- inputNumberGroup。也支持左侧下拉框选择。需要传入 data。和 date 类似

## 更新查询项的值。以上面为基础

```
this.programme.filterItems.updateFilterItem(详见组件文档)
```

## 动态添加查询项的值。以上面为基础

```
this.programme.filterItems.addItem(详见组件文档)
```

## 获取查询项的参数。以上面为基础

```
this.programme.filterItems.params
```

## 设置查询项的数据。以上面为基础

- 查询方案构造函数传入 dict 参数。key 和 item 的 field 对应
- 组件内部设置。data 属性传入即可
- 在 getConfig 接口中，见上面
- addDict 方式添加。key 和 item 的 field 对应

```
this.programme.filterItems.addDict({"is_checked-3-1": []})
```

## 跳转页面，从 url 带入 item 默认的 value 时 url 拼接方式

- field 为 item 的 field。value 为带入的值。值为数组的需要转成 string 以,拼接
- 常规: field=value
- inputNumberGroup: field=min,max 或者 field=type(下拉框的值),min,value
- date: field=时间类型(下拉框的值),开始时间字符串,结束时间字符串
- inputAndSelect: field=type(下拉框的值),value(输入框的值)

## 创建一般查询方案(只含有查询项)

```
# 定义model
import { Card } from 'antd';
import { NormalProgramme, NormalProgrammeComponent } from './utils';
const programme = new NormalProgramme({
  // 查询项配置。和主子表配置一样
  filterItems: [],

  // 点击搜索回掉
  handleSearch: () => {},

  // 一行显示个数
  count: 5
});

# 渲染组件。store为上一步定义的model
# 布局一般用antd的卡片布局。现在card的布局抽离出去了
<Card>
  <NormalProgrammeComponent store={programme}/>
<Card/>
```

## 显示批量报告(在你想要的时机)

```
import { BatchReport, renderModal } from '../../utils';

const data = {
  status: 'Successful',
  data: {
    total: 1,
    successedList: [],
    successed: 0,
    operationName: '订单审核',
    failed: 1,
    list: [
      {
        reason: '该订单已经通过审核!',
        saleOrderNo: 'XSDD2021-0101009',
      },
    ],
  },
};
renderModal(
  <BatchReport
    {...data.data}
    columns={[
      {
        title: '订单编号',
        dataIndex: 'saleOrderNo',
      },
      {
        title: '失败原因',
        dataIndex: 'reason',
      },
    ]}
  />
);

```

## 复制(不要每个页面都复制一遍)

- react 复制组件(react-copy-to-clipboard)

```
import { CopyToClipboard } from 'react-copy-to-clipboard';
<CopyToClipboard
  onCopy="回掉"
  text="文字"
>
  111
</CopyToClipboard>
```

- 直接复制(copy-to-clipboard)

```
import copy from 'copy-to-clipboard';
copy('复制文字');
```
