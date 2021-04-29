import { message } from 'antd';
import { observable, action, computed, set } from 'mobx';
import type { IObservableObject } from 'mobx';
import { observer } from 'mobx-react';

import type { IObj, IEgGridModel, IEgGridApi, StrOrNum } from '../egGridModel';
import { EgGridModel } from '../egGridModel';
import { MainSubStructureModel } from './mainSubStructureModel';
import { SubTableListModel } from './subTableListModel';

export interface ICustomModel{
  [key: string]: any;
}
export type TCustomModel = ICustomModel| IObservableObject;
export interface ISubTableModel{
  parent?: Partial<SubTableListModel>;
  tab?: {
    name: string;
    value: string;
  };
  grid?: IEgGridModel;
  api?: IEgGridApi;
  isCustom?: boolean;
  customModel?: TCustomModel;
  customView?: React.ReactType;
}

export class SubTableModel {
  @observable public parent: Partial<SubTableListModel> = {};

  @observable public top: Partial<MainSubStructureModel> = {};

  @observable public showSubTable: true;

  @observable public tab = {
    name: '',
    value: '',
  };

  @observable public grid?: IEgGridModel;

  @observable public api: IEgGridApi = {};

  @observable public notGrid = false;

  @observable public history: IObj = {};

  @observable public gridModel: EgGridModel;

  @observable public isCustom: boolean;

  @observable public customModel: ICustomModel;

  public CustomView: React.ReactNode;

  @computed public get isCursor(): boolean {
    return this.parent.activeTab === this.tab.value;
  }

  @computed public get isInited(): StrOrNum {
    return this.parent.tabsFlag.inited[this.tab.value];
  }

  @computed public get isSearched(): StrOrNum {
    return this.parent.tabsFlag.searched[this.tab.value];
  }

  constructor(options: ISubTableModel) {
    set(this, { ...(options || {}) });
    const { onSort, onRowClick, onRefresh, handlePageChange, onShowSizeChange } = this;
    if (options.isCustom) {
      this.CustomView = options.customView;
    } else {
      this.gridModel = new EgGridModel({
        ...options.grid,
        columns: options.grid.getColumns?.(this.top, this) ?? options.grid.columns,
        api: {
          onPageChange: handlePageChange,
          onShowSizeChange,
          onSort, // 排序
          onRowClick, // 行点击
          onRefresh,
        },
        parent: this,
      });
    }

    set(this, {
      history: {
        pageSize: options.grid?.pageSize || 50,
        sidx: '',
        sord: 'asc',
        page: 1,
      },
    });
    this.api.onQuery = this.requestOry(this.api.onQuery);
  }

  public onSort = action(({ sidx, sord }) => {
    const data = {
      ...this.history,
      sidx,
      sord,
    };
    this.queryDataAndSetState(data);
  });

  public onRowClick = action((id, row) => {
    // TODO: 刷新子表
    this.api.onRowClick?.(id, row);
  });

  public onRefresh = action(() => {
    const data = this.history;
    this.queryDataAndSetState(data);
    this.api.onRefresh?.(data);
  });

  public onShowSizeChange = action((page, pageSize) => {
    const data = {
      ...this.history,
      page,
      pageSize,
    };
    this.queryDataAndSetState(data);
    this.api.onShowSizeChange?.(page, pageSize);
  });

  public handlePageChange = action((page, pageSize) => {
    const data = {
      ...this.history,
      page,
      pageSize,
    };
    this.queryDataAndSetState(data);
    this.api.onPageChange?.(page, pageSize);
  });

  public onQuery = action(() => {
    const page = 1;
    const { pageSize = 50, sidx, sord } = this.history;

    // TODO: 重置表格参数
    this.queryDataAndSetState({
      page,
      pageSize,
      sidx,
      sord,
    });
  });

  public queryDataAndSetState = action((data) => {
    const { cursorRow, primaryKeyField } = this.top.gridModel;
    const pid = cursorRow[primaryKeyField];
    if (this.gridModel && Object.keys(this.gridModel).length) {
      this.gridModel.loading = true;
      if (!pid) {
        this.gridModel.clearToOriginal();
        return (this.gridModel.loading = false);
      }
      this.api.onQuery &&
        this.api.onQuery({
          data,
          pid,
          cursorRow,
          gridModel: this.gridModel,
        }).then(
          action((v: IObj) => {
            // 这里更改子表的初始化查询状态
            const searched = this.top.subTablesModel.tabsFlag.searched;
            this.top.subTablesModel.tabsFlag.searched = {
              ...searched,
              [this.tab.value]: true,
            };
            this.gridModel.loading = false;
            this.history = data;
            if (this.gridModel.showPager) {
              this.gridModel.current = data.page;
              this.gridModel.pageSize = data.pageSize;
            }
            if (v.status !== 'Successful') {
              this.gridModel.rows = [];
              this.gridModel.total = 0;
              return message.error(v.data);
            }
            this.gridModel.rows = v.data ? (this.gridModel.showPager ? v.data.list : v.data) : [];
            this.gridModel.total = v.data && this.gridModel.showPager ? v.data.totalCount : 0;
            return v;
          }),
          (msg) => console.log(msg)
        );
    } else {
      this.api.onQuery &&
        this.api.onQuery({
          data,
          pid,
          cursorRow,
          grid: this.gridModel,
        }).then(
          action((v: IObj) => {
            // gridModel用于设置动态列columns
            console.log('调用自定义内容查询');
            const searched = this.top.subTablesModel.tabsFlag.searched;
            this.top.subTablesModel.tabsFlag.searched = {
              ...searched,
              [this.tab.value]: true,
            };
            this.history = data;
            if (v && v.status !== 'Successful') {
              return message.error(v.data);
            }
            return v;
          }),
          (msg) => console.log(msg)
        );
    }
    return true;
  });

  // 包装子表的查询接口，如果快速多次调用查询接口，忽略前边的请求，只接受最后一个请求返回的数据
  public requestOry = (onQuery) => {
    let rejectOfLastRequest = null;
    let i = 0;
    return (...args) => {
      i++;
      if (rejectOfLastRequest) {
        rejectOfLastRequest(`忽略对subTable的第${i}次请求`);
      }
      return new Promise((resolve, reject) => {
        rejectOfLastRequest = reject;
        onQuery && onQuery.apply(this, args).then((v) => resolve(v));
      });
    };
  };
}
