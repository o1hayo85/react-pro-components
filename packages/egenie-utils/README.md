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

2. **FilterBase**查询项基本类。抽取统一的字段和方法
3. filterXXX。某个查询项类型。包括 model 和 component

- model 继承 FilterBase，不同配置在 model 内部实现(toProgramme、toParams、formatValue、reset 等)

4. **FilterItems 左右、上下查询方案底层都是这个** 对 FilterXXX 的 model 层管理，不实现组件，组件由具体的查询方案实现。具体配置参考说明文档

## 创建左右查询方案

1. 创建

```

import React from 'react';
import { FilterItemOptions, MainSubStructureModel, Programme, ProgrammeComponent } from '../../utils';

const filterItems: FilterItemOptions[] = [
  {
    type: 'radio',
    label: 'radio',
    field: 'radio',

    // 值改变回掉
    handleChangeCallback(value) {
      console.log(value);
    },
    data: [
      {
        value: 'sale_order_no-14-10',
        label: '订单号',

        // 此项是否显示输入框(可选可输入)
        // showInput: true,
      },
      {
        value: 'platform_order_code-15-10',
        label: '平台单号',
      },
    ],
  },

  // 只含有开始时间
  {
    // 标签宽度。和设计师沟通确认，原则上是不允许改
    labelWidth: 72,
    type: 'dateStart',
    field: 'dateStart',
    label: 'dateStart',

    // 是否必须
    required: true,

    // 时间改变回掉
    handleChangeCallback(value) {
      console.log(value);
    },
  },

  // 只含有结束时间
  {
    // 显示格式化
    format: 'YYYY-MM-DD',
    type: 'dateEnd',
    field: 'dateEnd',
    label: 'dateEnd',

    // 时间改变回掉
    handleChangeCallback(value) {
      console.log(value);
    },
  },

  // 左右查询方案-时间范围
  {
    type: 'date',
    field: 'date',
    label: 'date',

    // 时间改变回掉
    handleChangeCallback(value) {
      console.log(value);
    },
    formatParams: 'YYYY-MM-DD',
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
    format: 'YYYY-MM-DD',

    // 转化为params的时间格式
    formatParams: 'YYYY-MM-DD',

    // 时间改变回掉
    handleChangeCallback(value) {
      console.log(value);
    },
  },

  // checkbox
  {
    type: 'checkbox',
    label: '快递公司',
    field: 'courier_id-4-14',

    // 值改变回掉
    onChangeCallback(value) {
      console.log(value);
    },
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

    // 值改变回掉
    onChangeCallback(value) {
      console.log(value);
    },

    // 搜索的回掉
    onSearchCallback(value) {
      console.log(value);
    },

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

    // 值改变回掉
    onChangeCallback(value) {
      console.log(value);
    },

    // 动态加载项。逻辑参考antd
    loadData(data) {
      console.log(data);
    },
    data: [
      {
        value: 'sale_order_no-14-10',
        label: '订单号',
        isLeaf: false,
      },
      {
        value: 'platform_order_code-15-10',
        label: '平台单号',
      },
    ],
  },

  // 树
  {
    type: 'treeSelect',
    label: 'treeSelect',
    field: 'treeSelect',
    treeDataSimpleMode: true,
    treeData: [
      {
        id: 1,
        pId: null,
        value: '1',
        title: 'node1',
      },
      {
        id: 2,
        pId: 1,
        value: '2',
        title: 'node2',
      },
      {
        id: 3,
        pId: 1,
        value: '3',
        title: 'node3',
      },
      {
        id: 4,
        pId: null,
        value: '4',
        title: 'node4',
      },
    ],

    // 值改变回掉
    onChangeCallback(value) {
      console.log(value);
    },
  },

  // 输入框
  {
    type: 'input',
    field: 'receiver_name-14-12',
    label: 'input',

    // 值改变回掉
    onChangeCallback(value) {
      console.log(value);
    },
  },

  // number组合框
  {
    type: 'inputNumberGroup',
    field: 'total_num-2-10',
    label: 'inputNumberGroup',

    // 数字改变回掉
    handleChangeCallback(value) {
      console.log(value);
    },

    // 下拉框改变回掉。(前提得是下拉加number框的组合)
    handleSelectChangeCallback(value) {
      console.log(value);
    },
  },

  // 下拉框加输入框
  {
    type: 'inputAndSelect',
    label: 'inputAndSelect',
    field: 'inputAndSelect',
    selectValue: 'wmsReceiveOrderNo',
    placeholder: 'inputAndSelect',

    // 下拉框改变回掉
    handleSelectChangeCallback(value) {
      console.log(value);
    },

    // 输入框改变回掉
    handleInputChangeCallback(value) {
      console.log(value);
    },
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

    // 值改变回掉
    handleChangeCallback(value) {
      console.log(value);
    },
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
];

export default class extends React.Component {
  // 左右查询方案model
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
    filterItems,
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
import { BatchReport, renderModal } from 'egenie-utils';

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
  count: 一次打印页数。默认500,
  preview: 是否预览,
  printer: 打印机(可选),
  templateData: 后端返的模版数据,
  contents: 后端返的数据,
})
```

3. printWayBill 使用。详见组件说明文档。printSrc,tempType,checkPrint 最好和相关人员确认

```
import { printWayBill } from 'egenie-utils';
```

4. formatBarcodeData 格式化条码数据(有可能一页打多个条码)---然后打印

```
import { formatBarcodeData, printHelper } from 'egenie-utils';
const tempData = 后端返的模版数据;
const printList = 后端返的打印数据;
printHelper.toggleToRookie();
await printHelper.print({
    preview: 是否预览,
    printer: 打印机(可选),
    templateData: tempData,
    contents: formatBarcodeData(tempData?.rowCount, tempData?.colsCount, printList),
  });
```

5. getCustomPrintParam 获取自定义打印参数---打印请自写(参考上面打印的文档)

```
import { getCustomPrintParam } from 'egenie-utils';
const customPrintParam = await getCustomPrintParam(模版类型);
console.log(customPrintParam);
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

## 表格

### 主子表使用方式

> 常规使用直接使用下面代码即可, 详细配置项查看下方

```js
const mainSubModel = new MainSubStructureModel({
  buttons: [
    {
      text: '操作',
      permissionId: '1',
      icon: 'icon-d_print',
      handleClick: () => {
      },
      group: [
        {
          text: '按钮组操作',
          permissionId: '2',
          icon: 'icon-d_print',
          handleClick: () => {
          },
        },
      ],
    },
  ],
  grid: {
    columns: [
      {
        key: 'operate',
        name: '操作',
        width: 150,
        frozen: true, // 冻结列
        resizable: false,
        formatter: ({ row }) => {
          return <ActionColumn row={row} />;
        },
      },
      {
        key: 'remark',
        name: '备注',
        width: 150,
        editable: true,
        editorOptions: { editOnClick: false },
        editor: ({ row }) => { // 可编辑单元格
          const { wmsReceiveOrderId } = row;
          return (
            <Input
              className={styles.remark}
              defaultValue={row.remark}
              maxLength={25}
              onBlur={requestCenter.onBlurMark.bind(this, wmsReceiveOrderId)}
              onClick={requestCenter.onClickMark}
            />
          );
        },
      },
    ].map((v) => ({
      resizable: true,
      sortable: false,
      ...v,
    })),
    rows: [],
    primaryKeyField: 'wmsReceiveOrderId',
    sortByLocal: false,
    showCheckBox: true,
    showEmpty: true,
  },

  // 主表查询api
  api: {
    onQuery: (params) => {
      console.log(params, 'paramsparams');
      const { filterParams, ...rest } = params;
      return request<PaginationData<IReveiveDataList>>({
        url: api.receiveOrder,
        method: 'POST',
        data: {
          ...filterParams,
          ...rest,
        },
      });
    },
  },
  subTables: {
    activeTab: 'detail',
    tabsFlag: {
      inited: {
        detail: true,
        log: false,
      },
      searched: {},
    },
    list: [
      {
        tab: {
          name: '收货单明细',
          value: 'detail',
        },
        grid: {
          columns: [
            {
              key: 'tag',
              name: '标记',
            },
            {
              key: 'picUrl',
              name: '图片',
              formatter: ({ row }) => {
                return <ImgFormatter value={row.picUrl} />;
              },
            ...
            },
          ].map((v) => ({
            resizable: true,
            sortable: false,
            ...v,
          })),
          rows: [],
          primaryKeyField: 'wmsReceiveOrderDetailId',
          sortByLocal: false,
        },
        api: {
          onQuery: ({ data, pid, cursorRow, gridModel }) => {},
        },
      },
      {
        tab: {
          name: '日志',
          value: 'log',
        },
        grid: {
          columns: [
            {
              key: 'moduleType',
              name: '操作模块',
            },
          ],
          rows: [],
          primaryKeyField: 'id',
          sortByLocal: false,
          showCheckBox: false,
        },
        // 子表查询api
        api: {
          onQuery: ({ data, pid, cursorRow, gridModel }) => {},
        },
      },
    ],
  },
});
```

### 常用配置项说明

#### 1.列配置项

```js
    /** 列的名称。默认情况下，它将显示在标题单元格中 */
    name: string | ReactElement;
    /** 区分每一列的唯一键 */
    key: string;
    /** 列宽。 如果未指定，则根据网格宽度和其他列的指定宽度自动确定 */
    width?: number | string;
    /** 最小列宽 */
    minWidth?: number;
    /** 最大列宽 */
    maxWidth?: number;
    /** 单元格类名 */
    cellClass?: string | ((row: TRow) => string | undefined);
    /** 表头单元格类名 */
    headerCellClass?: string;
    /** 汇总行单元格类名 */
    summaryCellClass?: string | ((row: TSummaryRow) => string);
    /** 格式化单元格 */
    formatter?: React.ComponentType<FormatterProps<TRow, TSummaryRow>>;
    /** 格式化汇总单元格 */
    summaryFormatter?: React.ComponentType<SummaryFormatterProps<TSummaryRow, TRow>>;
    /** 格式化分组单元格 */
    groupFormatter?: React.ComponentType<GroupFormatterProps<TRow, TSummaryRow>>;
    /** 启用单元格编辑。 如果设置且未指定编辑器属性，则文本输入将用作单元格编辑器 */
    editable?: boolean | ((row: TRow) => boolean);
    colSpan?: (args: ColSpanArgs<TRow, TSummaryRow>) => number | undefined;
    /** 是否冻结列 */
    frozen?: boolean;
    /** 是否可调整大小 */
    resizable?: boolean;
    /** 是否可列排序 */
    sortable?: boolean;
    /** 第一次对列进行排序时，将列排序顺序设置为降序而不是升序 */
    sortDescendingFirst?: boolean;
    /** 编辑列单元格时要呈现的编辑器。 如果设置，则该列将自动设置为可编辑 */
    editor?: React.ComponentType<EditorProps<TRow, TSummaryRow>>;
    editorOptions?: {
        /** 默认false, 暂未用到 */
        createPortal?: boolean;
        /** 点击编辑，默认false */
        editOnClick?: boolean;
        /** 阻止默认取消编辑, 暂未用到  */
        onCellKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
        /** 在编辑器打开时控制默认的单元格导航行为， 暂未用到  */
        onNavigation?: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;
    };
    /** 每个标题单元格的标题渲染器 */
    headerRenderer?: React.ComponentType<HeaderRendererProps<TRow, TSummaryRow>>;
    /** 用于过滤列数据的组件，暂未用到，需重新封装 */
    filterRenderer?: React.ComponentType<FilterRendererProps<TRow, any, TSummaryRow>>;
    /** 自定义排序字段 */
    sidx?: string;
    /** 是否隐藏列，默认false */
    ejlHidden?: boolean;

```

#### 2.egGrid 配置项

```js
  /** 列配置，参考列配置项说明 */
  columns: Array<EnhanceColumn<IObj>>;
  /** 需要对列做特殊处理才用到，一般不需要 */
  getColumns?: (topClass: IObj, selfClass: IObj) => Array<EnhanceColumn<IObj>>;
  /** 行数据 */
  rows?: IObj[];
  /** 当前行 */
  cursorRow?: IObj[];
  /** 主键 */
  primaryKeyField: string;
  /** 行高 */
  rowHeight?: number;
  /** 表头行高 */
  headerRowHeight?: number;
  /** 是否可多选 */
  showCheckBox?: boolean;
  /** 已选择ids */
  selectedIds?: Set<React.Key>;
  /** 清空到原始状态 */
  clearToOriginal?: () => void;
  /** 开启本地排序，一般不用此项 */
  sortByLocal?: boolean;
  /** 排序方向，增序还是降序 */
  sortDirection?: SortDirection;
  /** 分页器-快速跳转 */
  showQuickJumper?: boolean;
  /** 分页器-分页大小list */
  pageSizeOptions?: string[];
  /** 分页器-每页大小 */
  pageSize?: number;
  /** 分页器-当前页码 */
  current?: number;
  /** 分页器-总条数 */
  total?: number;
  /** 分页器-是否显示分页器 */
  showPager?: boolean;
  /** 是否显示已勾选条数 */
  showSelectedTotal?: boolean;
  /** 是否显示重置按钮 */
  showReset?: boolean;
  /** 是否显示分页 */
  showRefresh?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 表格样式 */
  edgStyle?: React.CSSProperties;
  /** 表格查询接口api,配置项参考表格接口api配置说明 */
  api?: IEgGridApi;
 /** 查询参数，除非特殊约定，一般不用改此项 */
  queryParam?: {
    pageSize?: StrOrNum;
    page?: StrOrNum;
    sord?: StrOrNum;
    sidx?: StrOrNum;
    filterParams?: IObj;
  };
  /** 查询方案注入此方法，获取查询方案的值 */
  getFilterParams?: () => { [key: string]: string; };
  /** 表格包裹类名 */
  wrapClassName?: string;
  /** 是否显示空状态 */
  showEmpty?: boolean;
  /** 是否强制点击事件，默认false,设为true后，每次点击同一行也会调用接口 */
  forceRowClick?: boolean;
  /** 表格保存列必须要配置 */
  gridIdForColumnConfig?: string;
  /** 是否允许设置列显隐 */
  setColumnsDisplay?: boolean;
  /** 是够勾选汇总 */
  onSelectSum?: boolean;
  /** 需要汇总列的key[] */
  sumColumns?: key[];
  /** 需要汇总列的key[] */
  summaryRows?: ({row}) => [{[key]: number}];
```

#### 3.表格接口 api 配置说明

```js
  /** 行点击回调 */
  onRowClick?: (rowId: StrOrNum, row?: IObj) => void;
  /** 行选择改变回调 */
  onRowSelectChange?: (ids: Set<React.Key>) => void;
  /** 刷新主表回调 */
  onRefresh?: (param?: IObj) => void;
  /** 排序回调 */
  onSort?: (params: IObj) => void;
  /** 分页回调 */
  onPageChange?: (page: StrOrNum, pageSize: StrOrNum) => void;
  /** 分页下拉回调 */
  onShowSizeChange?: (page: StrOrNum, pageSize: StrOrNum) => void;
  /** 查询主表数据 */
  onQuery?: (params?) => Promise<unknown>;
```
