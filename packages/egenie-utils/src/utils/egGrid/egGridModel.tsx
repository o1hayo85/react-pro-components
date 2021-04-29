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
}

export class EgGridModel {
  public onlyGridStructure?: true; // 纯主表结构

  @observable public parent: IObj;

  @observable public columns = []; // 列配置

  @observable public rows = []; // 行数据，接口请求回来或者自己mock

  @observable public primaryKeyField = ''; // 配置主键的字段， 必须配置

  @observable public primaryKeyFieldValue: number | string = ''; // 主键的值

  @observable public showCheckBox = false; // 是否可以勾选

  @observable public rowHeight = 38; // 设置行高

  @observable public headerRowHeight = 42; // 设置header高度

  // 选中行的id组合
  @observable public selectedIds = new Set<React.Key>([]); // 已选择的ids

  @observable public sortColumnKey = ''; // 排序列的字段

  @observable public sortByLocal = true; // 是否本地排序

  @observable public sortDirection: SortDirection = 'NONE'; // 排序方向

  @observable public size: 'default' | 'small' = 'small'; // 分页器大小

  @observable public showQuickJumper = true; // 是否显示快速跳转

  @observable public pageSizeOptions = [ // 指定每页可以显示多少条
    '10',
    '20',
    '50',
    '100',
    '200',
    '500',
    '1000',
  ];

  @observable public pageSize = 50; // 每页条数

  @observable public current = 1; // 当前页码

  @observable public scrollLeftIsZero = true; // 横向滚动是否为0

  @observable public cursorRow: IObj = {}; // 当前行

  @observable public api: IEgGridApi; // 外部回调api, 行点击，排序，分页器

  @observable public showSelectedTotal = true; // 隐藏勾选条数

  @observable public showReset = true; // 隐藏重置按钮

  @observable public showPagination = true; // 隐藏分页器

  @observable public showRefresh = true; // 隐藏刷新

  @observable public showPager = true; // 隐藏分页整行

  @observable public edgStyle: React.CSSProperties;

  @observable public loading = false; // 表格数据加载loading

  @observable public total = 0; // 总条数

  @observable public wrapClassName = '';

  @observable public showEmpty = false;

  @observable public forceRowClick = false; // 是否强制每次点击行内事件都触发rowClick事件

  @computed public get selectRows() {
    const { selectedIds, rows, primaryKeyField } = this;
    return rows.filter((item) => selectedIds.has(item[primaryKeyField]));
  }

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

  @computed public get selectedRowsLength(): number {
    const { selectedIds } = this;
    return Array.from(selectedIds).length;
  }

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

  // 查询方案植入该方法
  public getFilterParams: () => {[key: string]: string; };

  // 行点击事件
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

  public triggerCursorRowClick = action(() => {
    this.api && this.api.onRowClick && this.api.onRowClick(this.cursorRow[this.primaryKeyField], this.cursorRow);
  });

  // TODO: 待去抖
  public onScroll = action((e) => {
    const { scrollLeft } = e.currentTarget;
    this.scrollLeftIsZero = scrollLeft === 0;
  });

  public onSelectedRowsChange = action((selectRows) => {
    this.selectedIds = selectRows;
    this.api?.onRowSelectChange && this.api.onRowSelectChange(selectRows);
  });

  public onResetSelected = action(() => {
    this.selectedIds = new Set([]);
  });

  public resetAllSelectedRows = action(() => {
    this.onResetSelected();
    this.api?.onRowSelectChange && this.api.onRowSelectChange(this.selectedIds);
  });

  public resetCursorRow = action(() => {
    this.primaryKeyFieldValue = '';
    this.beforeIdx = this.cursorIdx;
    this.cursorIdx = '';
    this.cursorRow = {};
    this.triggerCursorRowClick();
  });

  public resetAll = action(() => {
    this.resetAllSelectedRows();
    this.resetCursorRow();
  });

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

  public setCursorRowToFirst = action(() => {
    if (!this.rows.length) {
      return this.resetCursorRow();
    }
    this.beforeIdx = this.cursorIdx;
    this.cursorIdx = 0;
    this.cursorRow = this.rows[0];
    this.triggerCursorRowClick();
  });

  // 拖拽列
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
   * 排序相关
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

