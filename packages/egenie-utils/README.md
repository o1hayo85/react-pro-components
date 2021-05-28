## 具体 utils 组件文档，在 egenie-utils 仓库的 packages/egenie-utils 下执行 npm run doc，打开 docs 下的 index.html。(后期会部署到内网)

## 查询项关键简介

1. 关键字段说明

- type 区分类型
- field 区分每一个查询项。不可重复
- label 为显示文字。不可重复
- data 为数据的依赖
- toProgramme 创建查询方案时对每个查询项值的处理
- toParams 对外暴露的 params 的处理
- formatValue 格式化查询项值
- reset 查询项重置

2. FilterBase 类。查询项基本类。抽取统一的字段和方法
3. filterXXX。某个查询项类型。包括 model 和 component

- model 继承 FilterBase，不同配置在 model 内部实现(toProgramme、toParams、formatValue、reset 等)

4. FilterItems 类是对 FilterXXX 的 model 层管理，不实现组件，组件由具体的查询方案实现。具体配置参考说明文档

## 创建左右查询方案

1. 创建

```
import React from 'react';
import { MainSubStructureModel, Programme, ProgrammeComponent } from 'egenie-utils';

export default class extends React.Component {
  public programme = new Programme({
    gridModel: new MainSubStructureModel({
      grid: {
        primaryKeyField: 'a',
        columns: [],
      },
      api: {
        onQuery: () => {
          console.log(this.programme.filterItems.params);
          return Promise.resolve();
        },
      },
    }),

    fieldMap: {
      courier: 'courier_id-4-14',
      shop: 'shop_id-4-10',
      pay_type: 'pay_type-4-1',
    },
    filterItems: [
      {
        type: 'radio',
        label: 'radio',
        field: 'radio',
        data: [
          {
            value: 'sale_order_no-14-10',
            label: '订单号',
          },
          {
            value: 'platform_order_code-15-10',
            label: '平台单号',
          },
        ],
      },

      // 开始时间
      {
        type: 'dateStart',
        field: 'dateStart',
        label: 'dateStart',
        handleChangeCallback(a) {
          console.log(a);
        },
      },

      // 结束时间
      {
        format: 'YYYY-MM-DD',
        type: 'dateEnd',
        field: 'dateEnd',
        label: 'dateEnd',
        handleChangeCallback(a) {
          console.log(a);
        },
      },

      // 左右查询方案-时间范围
      {
        type: 'date',
        field: 'date',
        label: 'date',
        selectValue: 'sale_order_status.pay_time',
        data: [
          {
            value: 'sale_order_status.pay_time',
            label: '付款时间',
          },
        ],
      },

      // 时间范围
      {
        type: 'dateRange',
        field: 'dateRange',
        label: 'dateRange',
      },

      // checkbox
      {
        type: 'checkbox',
        label: '快递公司',
        field: 'courier_id-4-14',
        data: [
          {
            value: 'sale_order_no-14-10',
            label: '订单号',
          },
          {
            value: 'platform_order_code-15-10',
            label: '平台单号',
          },
        ],
      },

      // 下拉框
      {
        type: 'select',

        // 多选标识
        mode: 'multiple',
        label: '店铺',
        field: 'shop_id-4-10',
        data: [
          {
            value: 'sale_order_no-14-10',
            label: '订单号',
          },
          {
            value: 'platform_order_code-15-10',
            label: '平台单号',
          },
        ],
      },

      // 级联
      {
        type: 'cascader',
        label: 'cascader',
        field: 'cascader',
        data: [
          {
            value: 'sale_order_no-14-10',
            label: '订单号',
          },
          {
            value: 'platform_order_code-15-10',
            label: '平台单号',
          },
        ],
      },

      // 输入框
      {
        type: 'input',
        field: 'receiver_name-14-12',
        label: 'input',
      },

      // number组合框
      {
        type: 'inputNumberGroup',
        field: 'total_num-2-10',
        label: 'inputNumberGroup',
      },

      // 下拉框加输入框
      {
        type: 'inputAndSelect',
        label: 'inputAndSelect',
        field: 'inputAndSelect',
        selectValue: 'wmsReceiveOrderNo',
        placeholder: 'inputAndSelect',
        data: [
          {
            value: 'sourceNo',
            label: '来源单号',
          },
          {
            value: 'wmsReceiveOrderNo',
            label: '收货单编号',
          },
        ],
      },

      // 下拉框加输入框
      {
        type: 'inputOrSelect',
        label: 'inputOrSelect',
        field: 'inputOrSelect',
        data: [
          {
            value: 'sourceNo',
            label: '来源单号',
          },
          {
            value: 'wmsReceiveOrderNo',
            label: '收货单编号',
          },
        ],
      },
    ],
    moduleName: 'OMSOrders',
    dictList: 'order_type,blacklist_type,purchase_state_type,courier_print_mark_state,sku_purchase_state_type,origin_type,pay_type,cn_service,trade_from,system_order_state',
    itemList: 'shop,warehouse,dts_status_adapter,courier,wms_order_state',
  });

  render() {
    return (
      <ProgrammeComponent store={this.programme}/>
    );
  }
}
```

- gridModel 为表格参数，详见表格文档
- moduleName 为查询方案标识，必须
- dictList、itemList 为 getConfig 接口参数，可选。fieldMap 返回 key 和 field 的映射
- filterItems 为初始化的查询项配置。type、field、label 必须。详见 item 的说明文档
- radio。data 加参数 showInput 字段可以变为原来的 mixedInput
- inputNumberGroup。也支持左侧下拉框选择。需要传入 data。和 date 类似

2. 更新查询项的值。以上面为基础

```
this.programme.filterItems.updateFilterItem(详见组件文档)
```

3. 动态添加查询项的值。以上面为基础

```
this.programme.filterItems.addItem(详见组件文档)
```

4. 获取查询项的参数。以上面为基础

```
this.programme.filterItems.params
```

5. 设置查询项的数据。以上面为基础

- 查询方案构造函数传入 dict 参数。key 和 item 的 field 对应
- 组件内部设置。data 属性传入即可
- 在 getConfig 接口中，见上面
- addDict 方式添加。key 和 item 的 field 对应

```
this.programme.filterItems.addDict({"is_checked-3-1": []})
```

6. 跳转页面，从 url 带入 item 默认的 value 时 url 拼接方式

- field 为 item 的 field。value 为带入的值。值为数组的需要转成 string 以,拼接
- 常规: field=value
- inputNumberGroup: field=min,max 或者 field=type(下拉框的值),min,max
- date: field=时间类型(下拉框的值),开始时间字符串,结束时间字符串
- inputAndSelect: field=type(下拉框的值),value(输入框的值)

## 创建一般查询方案(只含有查询项)

1. 定义 model

```
import { Card } from 'antd';
import { NormalProgramme, NormalProgrammeComponent } from 'egenie-utils';
const programme = new NormalProgramme({
  // 查询项配置。和左右查询方案配置一样
  filterItems: [],

  // 点击搜索回掉
  handleSearch: () => {},

  // 一行显示个数
  count: 5
});
```

2. 渲染组件

```
// store为上一步定义的model
// 外层布局请自写。一般用antd的Card
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

1. react 复制组件(react-copy-to-clipboard)

```
import { message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
<CopyToClipboard
  onCopy={() => message.success({
    content: '复制成功',
    key: id,
  })}
  text={文本}
>
  <span>
    文本
    &nbsp;
    <i className="icon-copy"/>
  </span>
</CopyToClipboard>
```

2. 直接复制(copy-to-clipboard)

```
import copy from 'copy-to-clipboard';
copy('复制文字');
```

## 打印

1. 实现关键简介

- [菜鸟打印文档](https://www.cnblogs.com/micro-chen/p/8420944.html)
- 首先对菜鸟、pdd、京东、新的插件打印做底层 ws 层或者插件层的封装(没有业务)。对外暴露 getPrinters、print 方法。具体由内部实现。如 RookieAndPddPrint 类
- PrintHelper 类。对所有打印做管理，提供 getPrinters、print。处理一些通用的数据逻辑。采用状态模式。**具体调用 printHelper.print 的时候一定要切换打印类型(toggleToXXX),切具体类型由业务决定,不切换后果自负**
- PrintWayBillModel 类。对电子面单的封装
- CustomPrintModal 组件。自定义打印弹框的封装。打印逻辑自行实现

2. printHelper 使用

```
// 引入
import { printHelper } from 'egenie-utils';

// 获取打印机列表
printHelper.getPrinters().then((info) => {console.log(info)})

// 打印
printHelper.print({
  preview: false,
  printer: 打印机,
  templateData: 后端返的模版数据,
  contents: 后端返的数据,
})
```

3. printWayBill 使用。详见组件说明文档。printSrc,tempType,checkPrint 最好和相关人员确认

```
import { printWayBill } from 'egenie-utils';
```

## 菜单-LayoutGuide

1. 介绍

- 包括左侧菜单导航栏；顶部 tab 拦，用户信息和下拉操作栏(hover 用户名展示)

2. LayoutGuide 使用

```

//引入
import {LayoutGuide} from 'egenie-utils';

const defaultDashboard = (<div>首页</div>)
const srcParams = [{id:506, params:'name=12&sex=0'}]
const userInfoLeft =  (<div>用户信息左侧扩展内容</div>)

//用户信息下拉列表
const userInfoRight = [
  {id:506,name:'销售开单', callback: () => top.egenie.openTab(url, id, name, icon)}
]
<LayoutGuide
  defaultDashboard={defaultDashboard}
  srcParams={srcParams}
  userInfoLeft={userInfoLeft()}
  userInfoRight={userInfoRight}
/>
```

## 登录相关-LoginForm

1. 介绍

- 包括登录，注册，忘记密码

2. LoginForm 使用

```

//引入-第一步
import { LoginForm } from 'egenie-utils';

// registryPath有路由就展示按钮，反之不展示。changePasswordPath同理

<LoginForm
  registryPath=”/egenie-erp-home/registry“,
  changePasswordPath=”/egenie-erp-home/findPassword“
/>

//routes.tsx文件补充路由-第二步
import { FindPassword, Registry } from 'egenie-utils';
[
  {
    path: '/egenie-erp-home/registry',
    title: '注册‘,
    exact:true,
    component: Registry,
    loginPath: 'egenie-erp-home/login,
    logoImg: 'https://fronts.runscm.com/egenie-common/images/bossBg.png',
    logoText: '衫数科技运营管理平台'
  },
  {
    ....
  }

]
```
