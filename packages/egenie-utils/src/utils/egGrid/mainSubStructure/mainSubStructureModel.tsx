import { set, observable, action } from 'mobx';
import { ReactEventHandler } from 'react';
import { EgGridModel } from '../egGridModel';
import type { IObj, IEgGridApi, IEgGridModel } from '../egGridModel';
import { SubTableListModel } from './subTableListModel';
import type { ISubTableModel } from './subTableModel';

interface IButton {
  text: string; // 必填
  permissionId?: string; // 必填
  handleClick: (event: ReactEventHandler) => void; // 必填
  icon?: string;
  idx?: string | number;
  display?: (rows?) => boolean;
  group?: IButton[];
}

interface IMainSubStructureModel {
  grid: IEgGridModel;
  api: IEgGridApi;
  subTables?: {
    activeTab: string;
    tabsFlag: {
      inited?: IObj;
      searched?: IObj;
    };
    list: ISubTableModel[];
  };
  history?: IObj;
  hiddenSubTable?: boolean;
  buttons?: IButton[];
}

export class MainSubStructureModel {
  public mainSubStructure?: true; // 主子表结构

  @observable public grid: IEgGridModel;

  @observable public api: IEgGridApi = {};

  @observable public gridModel: EgGridModel;

  @observable public history: IObj = {};

  @observable public subTablesModel: IObj = {};

  @observable public subTables: IMainSubStructureModel['subTables'];

  @observable public buttons: IMainSubStructureModel['buttons'];

  @observable public foldModel = {
    tabPaneheight: 350,
    dragHeight: 0,
    startDragY: 0,
    fullScreen: false,
    onDragStart: action((e) => {
      // e.preventDefault();
      e.stopPropagation();
      this.foldModel.startDragY = e.clientY;
    }),
    onDragStop: action((e) => {
      e.preventDefault();
      e.stopPropagation();

      // this.foldModel.tabPaneheight = (350 - this.foldModel.dragHeight);
      this.foldModel.tabPaneheight += this.foldModel.startDragY - e.clientY;
    }),

    /* onDraging: action((e) => {
         e.stopPropagation();
         const { clientY } = e;
         if (this.foldModel.dragHeight === (clientY - this.foldModel.startDragY)) {
           return;
         }
         this.foldModel.dragHeight = clientY - this.foldModel.startDragY;
         this.foldModel.tabPaneheight -= (clientY - this.foldModel.startDragY);
         console.log(clientY - this.foldModel.startDragY, 'this.foldModel.startDragY');
       }), */
  };

  @observable public hiddenSubTable = false; // 是否只有主表,默认主子表

  public getFilterParams: () => {[key: string]: string; };

  constructor({ ...options }: IMainSubStructureModel) {
    set(this, { ...(options || {}) });
    this.setMainGridModel(options.grid, options.api);
    this.setSubTablesModel(options.subTables);
    set(this, {
      history: {
        pageSize: options.grid.pageSize || 50,
        sidx: '',
        sord: 'asc',
        page: 1,
      },
    });
  }

  public setMainGridModel = action((grid, api) => {
    const { onSort, onRowClick, onRefresh, handlePageChange, onShowSizeChange, onQuery } = this;
    this.gridModel = new EgGridModel({
      ...grid,
      columns: grid.getColumns?.(this) ?? grid.columns,
      api: {
        onPageChange: handlePageChange,

        onShowSizeChange,
        onSort, // 排序
        onRowClick, // 行点击
        onRefresh,
        onQuery,
      },
      parent: this,
    });
  });

  public setSubTablesModel = action((subTables) => {
    this.subTablesModel = new SubTableListModel({
      ...subTables,
      top: this,
    });
  });

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
    const { activeTab, listModel, tabsFlag } = this.subTablesModel;
    tabsFlag.searched = {}; // 能进来说明点击的是不同行，所以清空searchFlag
    const table = listModel.find((el) => el.tab.value === activeTab);
    if (table) {
      const { gridModel } = table;
      gridModel && gridModel.resetCursorRow && gridModel.resetCursorRow();
      table.onQuery();
    }
    this.api.onRowClick?.(id, row);
  });

  public onRefresh = action(() => {
    const data = this.history;
    this.queryDataAndSetState(data);
    this.api.onRefresh?.(data);
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

  public onShowSizeChange = action((page, pageSize) => {
    const data = {
      ...this.history,
      page,
      pageSize,
    };
    this.queryDataAndSetState(data);
    this.api.onShowSizeChange?.(page, pageSize);
  });

  public onQuery = action((): Promise<unknown> => {
    const filterParams = typeof this.getFilterParams === 'function' ? this.getFilterParams() : {};
    const params = Object.assign(this.gridModel.queryParam, { filterParams });

    // TODO: 重置表格参数
    this.gridModel.resetAll();
    params.page = 1;
    return this.queryDataAndSetState(params);
  });

  public queryDataAndSetState = action((data, flagOfRefresh = {}): Promise<unknown> => {
    this.gridModel.loading = true;
    this.history = { ...data };

    // 原来promise在catch时没有被reject
    if (this.api.onQuery) {
      return this.api.onQuery(data).then(
        action((v: IObj) => {
          this.gridModel.current = data.page >>> 0;
          this.gridModel.pageSize = data.pageSize >>> 0;
          this.gridModel.rows = v.data.list || [];
          this.gridModel.total = v.data.totalCount >>> 0;
          return data;
        })
      )
        .catch(() => {
          this.gridModel.rows = [];
          this.gridModel.total = 0;
        })
        .finally(() => {
          this.gridModel.loading = false;
        });
    } else {
      return Promise.reject();
    }
  });
}
