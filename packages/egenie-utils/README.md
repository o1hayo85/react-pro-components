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
