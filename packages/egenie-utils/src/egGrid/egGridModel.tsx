import { set, observable, action, toJS, computed } from 'mobx';
import React from 'react';
import type { Column, HeaderRendererProps, SortDirection } from 'react-data-grid';
import { SelectColumn } from 'react-data-grid';
import { DraggableHeaderRenderer } from './headerRenderers/draggableHeaderRenderer';

export type StrOrNum = number | string;

export interface EnhanceColumn<TRow, TSummaryRow = unknown> extends Column<TRow> {
  sidx?: string;
  ejlHidden?: boolean;
}

export interface IObj {
  [key: string]: any;
}

export type ColumnType = Array<EnhanceColumn<IObj>>;

export interface IEgGridApi {
  onRowClick?: (rowId: StrOrNum, row?: IObj) => void;
  onRowSelectChange?: (ids: Set<React.Key>) => void;
  onRefresh?: (param?: IObj) => void;
  onSort?: (params: IObj) => void;
  onPageChange?: (page: StrOrNum, pageSize: StrOrNum) => void;
  onShowSizeChange?: (page: StrOrNum, pageSize: StrOrNum) => void;
  onQuery?: (params?) => Promise<unknown>;
}

export interface IEgGridModel {
  columns: Array<EnhanceColumn<IObj>>;
  getColumns?: (topClass: IObj, selfClass: IObj) => Array<EnhanceColumn<IObj>>;
  rows?: IObj[];
  cursorRow?: IObj[];
  primaryKeyField: string;
  rowHeight?: number;
  headerRowHeight?: number;
  showCheckBox?: boolean;
  selectedIds?: Set<React.Key>;
  clearToOriginal?: () => void;

  sortByLocal?: boolean;
  sortDirection?: SortDirection;

  showQuickJumper?: boolean;
  pageSizeOptions?: string[];
  pageSize?: number;
  current?: number;
  total?: number;

  showSelectedTotal?: boolean;
  showReset?: boolean;
  showPager?: boolean;
  showRefresh?: boolean;

  loading?: boolean;

  edgStyle?: React.CSSProperties;

  api?: IEgGridApi;

  queryParam?: {
    pageSize?: StrOrNum;
    page?: StrOrNum;
    sord?: StrOrNum;
    sidx?: StrOrNum;
    filterParams?: IObj;
  };
  getFilterParams?: () => {[key: string]: string; };
  parent?: IObj;
  wrapClassName?: string;
  showEmpty?: boolean;
  forceRowClick?: boolean;
  showNoSearchEmpty?: boolean;
  showNormalEmpty?: boolean;
}

export class EgGridModel {
  public onlyGridStructure?: true; // 纯主表结构

  @observable public parent: IObj;

  /**
    * 列配置
    * [{
    *   key: 'wmsReceiveOrderNo',
    *   name: '收货单编号',
    *   width: 200,
    *   sortable: true,
    *   resizable: true
    *  }]
    */
  @observable public columns = []; // 列配置

  /**
   * 行数据，接口请求回来或者自己mock
   */
  @observable public rows = [];

  /**
   * 配置主键的字段， 必须配置
   */
  @observable public primaryKeyField = '';

  /**
   * 主键的值
   */
  @observable public primaryKeyFieldValue: number | string = '';

  /**
   * 是否可以勾选
   */
  @observable public showCheckBox = false;

  /**
   * 设置行高，默认38
   */
  @observable public rowHeight = 38;

  /**
   * 表头高度，默认42
   */
  @observable public headerRowHeight = 42;

  /**
   * 已选择的ids，使用时Array.from(selectedIds)
   */
  @observable public selectedIds = new Set<React.Key>([]);

  /**
   * 排序列的字段
   */
  @observable public sortColumnKey = '';

  /**
   * 是否本地排序
   */
  @observable public sortByLocal = true;

  /**
   * 排序方向
   */
  @observable public sortDirection: SortDirection = 'NONE';

  /**
   * 分页器大小
   */
  @observable public size: 'default' | 'small' = 'small';

  /**
   * 是否显示快速跳转
   */
  @observable public showQuickJumper = true;

  /**
   * 指定每页可以显示多少条
   */
  @observable public pageSizeOptions = [
    '10',
    '20',
    '50',
    '100',
    '200',
    '500',
    '1000',
  ];

  /**
   * 指每页条数
   */
  @observable public pageSize = 50;

  /**
   * 当前页码
   */
  @observable public current = 1;

  /**
   * 横向滚动是否为0
   */
  @observable public scrollLeftIsZero = true;

  /**
   * 当前行
   */
  @observable public cursorRow: IObj = {};

  /**
   * 外部回调api, 行点击，排序，分页器
   */
  @observable public api: IEgGridApi;

  /**
   * 隐藏勾选总条数
   */
  @observable public showSelectedTotal = true;

  /**
   * 隐藏重置按钮
   */
  @observable public showReset = true;

  /**
   * 隐藏分页器
   */
  @observable public showPagination = true;

  /**
   * 隐藏刷新
   */
  @observable public showRefresh = true;

  /**
   * 隐藏分页器整行
   */
  @observable public showPager = true;

  /**
   * 表格包裹样式
   */
  @observable public edgStyle: React.CSSProperties;

  /**
   * 表格数据加载loading
   */
  @observable public loading = false;

  /**
   * 总条数
   */
  @observable public total = 0;

  /**
   * 最外层包裹样式
   */
  @observable public wrapClassName = '';

  /**
   * 显示空状态,有查询按钮
   */
  @observable public showEmpty = false;

  /**
   * 显示空状态，无查询按钮
   */
  @observable public showNoSearchEmpty = false;

  /**
   * 显示普通空态
   */
  @observable public showNormalEmpty = false;

  /**
   * 是否强制每次点击行内事件都触发rowClick事件
   */
  @observable public forceRowClick = false;

  /**
   * 获取的选择的行数据
   */
  @computed public get selectRows() {
    const { selectedIds, rows, primaryKeyField } = this;
    return rows.filter((item) => selectedIds.has(item[primaryKeyField]));
  }

  /**
   * 组合序号列之后的行数据，渲染用，外部一般不用
   */
  @computed public get _rows() {
    const { rows } = this;
    if (!rows || !rows.length) {
      return [];
    }
    const { pageSize, current } = this;
    const currentPage = current || 1;
    const ret = rows.map((el, index) => {
      const row = { ...el };
      const orderNo = (currentPage - 1) * pageSize + index + 1;
      row.gridOrderNo = orderNo <= 9 ? `0${orderNo}` : orderNo;
      return row;
    });
    return ret;
  }

  /**
   * 选择行的数量
   */
  @computed public get selectedRowsLength(): number {
    const { selectedIds } = this;
    return Array.from(selectedIds).length;
  }

  /**
   * 查询表格数据参数
   */
  @computed public get queryParam(): IEgGridModel['queryParam'] {
    const { pageSize, current, sortDirection, sortColumnKey } = this;
    const filterParams: IObj = typeof (this.getFilterParams) === 'function' ? { filterParams: this.getFilterParams() } : {};
    return Object.assign(filterParams, {
      pageSize,
      page: current,
      sord: sortDirection === 'NONE' ? '' : sortDirection,
      sidx: sortColumnKey,
    });
  }

  public defaultRows: IObj[];

  @observable private beforeIdx: StrOrNum = '';

  @observable private cursorIdx: StrOrNum = '';

  constructor({ ...options }: IEgGridModel) {
    // const { columns, showCheckBox = true } = options;
    options.columns = this.prevHandleColumns(options);
    set(this, { ...(options || {}) });
  }

  public rowKeyGetter = (row: IObj) => {
    return row[this.primaryKeyField];
  };

  /**
   * 查询方案注入此方法，可通过gridModel.getFilterParams获取参数
   */
  public getFilterParams: () => {[key: string]: string; };

  /**
   * 行点击事件
   */
  public onRowClick = action((rowIdx, row) => {
    this.primaryKeyFieldValue = row[this.primaryKeyField];

    if (~rowIdx) {
      this.beforeIdx = this.cursorIdx;
      this.cursorIdx = rowIdx;
      this.cursorRow = row;
    }
    if (this.forceRowClick) {
      return this.triggerCursorRowClick();
    }
    row && this.beforeIdx !== this.cursorIdx && this.triggerCursorRowClick();
  });

  /**
   * 触发当前行点击事件
   */
  public triggerCursorRowClick = action(() => {
    this.api && this.api.onRowClick && this.api.onRowClick(this.cursorRow[this.primaryKeyField], this.cursorRow);
  });

  /**
   * 距离左侧滚动距离，目前用来渲染固定列的阴影
   * TODO: 待去抖
   */
  public onScroll = action((e) => {
    const { scrollLeft } = e.currentTarget;
    this.scrollLeftIsZero = scrollLeft === 0;
  });

  /**
   * 选择行切换时触发行选择改变事件
   */
  public onSelectedRowsChange = action((selectRows) => {
    this.selectedIds = selectRows;
    this.api?.onRowSelectChange && this.api.onRowSelectChange(selectRows);
  });

  public onResetSelected = action(() => {
    this.selectedIds = new Set([]);
  });

  /**
   * 重置行选择，触发外部行选择change事件
   */
  public resetAllSelectedRows = action(() => {
    this.onResetSelected();
    this.api?.onRowSelectChange && this.api.onRowSelectChange(this.selectedIds);
  });

  /**
   * 重置聚焦行
   */
  public resetCursorRow = action(() => {
    this.primaryKeyFieldValue = '';
    this.beforeIdx = this.cursorIdx;
    this.cursorIdx = '';
    this.cursorRow = {};
    this.triggerCursorRowClick();
  });

  /**
   * 重置选择行和聚焦行
   */
  public resetAll = action(() => {
    this.resetAllSelectedRows();
    this.resetCursorRow();
  });

  /**
   * 重置所有
   */
  public clearToOriginal = action(() => {
    // 主表清空字表
    set(this, {
      rows: [],
      total: 0,
      current: 1,
      selectedIds: new Set([]),
      cursorIdx: '',
      cursorRow: {},
    });
    this.resetAll();
  });

  /**
   * 设置聚焦行为表格第一行
   */
  public setCursorRowToFirst = action(() => {
    if (!this.rows.length) {
      return this.resetCursorRow();
    }
    this.beforeIdx = this.cursorIdx;
    this.cursorIdx = 0;
    this.cursorRow = this.rows[0];
    this.triggerCursorRowClick();
  });

  /**
   * 组装拖拽列， TODO: 配置draggble参数
   */
  public draggableColumns = () => {
    const { columns } = this;
    const HeaderRenderer = (props: HeaderRendererProps<IObj>) => {
      return (
        <DraggableHeaderRenderer
          {...props}
          onColumnsReorder={handleColumnsReorder}
        />
      );
    };

    const handleColumnsReorder = (sourceKey: string, targetKey: string) => {
      const sourceColumnIndex = columns.findIndex((c) => c.key === sourceKey);
      const targetColumnIndex = columns.findIndex((c) => c.key === targetKey);
      const reorderedColumns = [...columns];

      reorderedColumns.splice(
        targetColumnIndex,
        0,
        reorderedColumns.splice(sourceColumnIndex, 1)[0]
      );

      this.columns = reorderedColumns;
    };

    return columns.map((c) => {
      const key = c.key;
      if (key === 'select-row' || key === 'gridOrderNo' || key === this.primaryKeyField || c.frozen) {
        return c;
      }
      return {
        ...c,
        headerRenderer: HeaderRenderer,
      };
    });
  };

  /**
   * 本地排序
   */
  public localSort = action((sortColumn: string, sortDirection: SortDirection) => {
    console.log(sortColumn, sortDirection, '排序字段和方式');
    this.sortColumnKey = sortColumn;
    this.sortDirection = sortDirection;
    if (sortDirection === 'ASC') {
      this.defaultRows = toJS(this.rows).map(({ ...el }) => {
        return { ...el };
      });
    }

    const comparer = (a, b) => {
      const res = Number(a[sortColumn]) - Number(b[sortColumn]);
      if (Number.isNaN(res)) {
        a = a[sortColumn] ? `${a[sortColumn]}` : '';
        b = b[sortColumn] ? `${b[sortColumn]}` : '';
      }
      const ret = Number.isNaN(res) ? a.toLowerCase().localeCompare(b.toLowerCase()) : res;
      if (sortDirection === 'ASC') {
        return ret;
      }
      if (sortDirection === 'DESC') {
        return -ret;
      }
    };

    const rows = sortDirection === 'NONE' ? toJS(this.defaultRows) : this.rows.sort(comparer);

    this.rows = rows;
  });

  /**
   * 远端排序
   */
  public remoteSort = action((sortColumn, sortDirection) => {
    this.sortColumnKey = sortColumn;
    this.sortDirection = sortDirection;
    const col = this.columns.find((v) => v.key === sortColumn);
    const realSortColumn = col && col.sidx ? col.sidx : sortColumn;
    const param = sortDirection === 'NONE' ? {
      sidx: '',
      sord: '',
    } : {
      sidx: realSortColumn,
      sord: sortDirection.toLowerCase(),
    };
    this.api.onSort && this.api.onSort(param);
  });

  /**
   * 触发表格刷新，调用api.onRefresh方法
   */
  public onRefresh = action(() => {
    if (this.api.onRefresh) {
      this.loading = true;
      this.api.onRefresh();
    }
  });

  /**
   * 分页器change事件
   */
  public onPageChange = action((page, pageSize) => {
    console.log('onPageChange', page, pageSize);
    set(this, {
      current: page,
      pageSize,
    });
    this.api.onPageChange && this.api.onPageChange(page, pageSize);
  });

  /**
   * 分页pageSizeChange
   */
  public onShowSizeChange = action((page, pageSize) => {
    console.log('onShowSizeChange', page, pageSize);
    const { resetAll } = this;

    set(this, {
      current: 1,
      pageSize,
    });
    resetAll();

    this.api.onShowSizeChange && this.api.onShowSizeChange(1, pageSize);
    return 'reject';
  });

  /**
   * 表格查询事件，组合查询方案参数、重置所有
   */
  public onQuery = action((): Promise<unknown> => {
    const { pageSize, current, sortDirection, sortColumnKey } = this;
    const filterParams = typeof (this.getFilterParams) === 'function' ? this.getFilterParams() : {};
    if (!this.api.onQuery) {
      return Promise.reject();
    }
    this.resetAll();

    // @ts-ignore
    return this.api.onQuery({
      pageSize,
      page: current,
      sord: sortDirection,
      sidx: sortColumnKey,
      filterParams,
    });
  });

  /**
   * 预处理列配置，组合序号列
   */
  public prevHandleColumns = (options) => {
    const { columns = [], showCheckBox = true } = options;
    if (!columns.length) {
      return columns;
    }
    const ret = (showCheckBox ? [SelectColumn] : []).concat([
      {
        key: 'gridOrderNo',
        width: 50,
        name: '序号',
        frozen: true,
        sortable: false,
        ejlHidden: false,
        formatter: ({ row }) => (
          <div style={{ textAlign: 'left' }}>
            {row.gridOrderNo}
          </div>
        ),
      },
      ...columns,
    ]);

    return ret;
  };
}

