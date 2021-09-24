---
title: 表格
order: 3
---

## 列配置

```ts
interface Columns {
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
}
```

## egGrid 配置

```ts
interface EgGrid {
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
  getFilterParams?: () => { [key: string]: string };

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
  summaryRows?: ({ row }) => [{ [key]: number }];
}
```

## 接口 api 配置

```ts
interface Api {
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
}
```
