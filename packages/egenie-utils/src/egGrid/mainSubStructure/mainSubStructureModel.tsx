import { set, observable, action } from 'mobx';
import { ReactEventHandler } from 'react';
import { EgGridModel } from '../egGridModel';
import { SubTableListModel } from './subTableListModel';
import type { IObj, IEgGridApi, IEgGridModel } from '../egGridModel';
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

export interface IMainSubStructureModel {
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

  /**
   * 表格配置，参考IEgGridModel
   */
  @observable public grid: IEgGridModel;

  /**
   * 表格配置，参考IEgGridApi
   */
  @observable public api: IEgGridApi = {};

  /**
   * 实例化时内部设置，外部使用方式同独立表格使用，此处为主表的gridModel
   */
  @observable public gridModel: EgGridModel;

  /**
   * 存储上一次查询参数
   */
  @observable public history: IObj = {};

  /**
   * 子表model, 内部设置，无需外部调用
   */
  @observable public subTablesModel: IObj = {};

  /**
   * 子表model，外部配置
   */
  @observable public subTables: IMainSubStructureModel['subTables'];

  /**
   * 主表button，外部配置
   */
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

  /**
   * 查询方案注入此方法，可通过gridModel.getFilterParams获取参数
   */
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

  /**
   * 设置主子表结构的主表gridModel，调用主表方式为：mainSubStructureModel.gridModel.xxxx
   */
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

  /**
   * 设置子表list
   */
  public setSubTablesModel = action((subTables) => {
    this.subTablesModel = new SubTableListModel({
      ...subTables,
      top: this,
    });
  });

  /**
   * 主表排序
   */
  public onSort = action(({ sidx, sord }) => {
    const data = {
      ...this.history,
      sidx,
      sord,
    };
    this.queryDataAndSetState(data);
  });

  /**
   * 主表行点击
   */
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

  /**
   * 主表刷新
   */
  public onRefresh = action(() => {
    const data = this.history;
    this.queryDataAndSetState(data);
    this.api.onRefresh?.(data);
  });

  /**
   * 主表pageChange
   */
  public handlePageChange = action((page, pageSize) => {
    const data = {
      ...this.history,
      page,
      pageSize,
    };
    this.queryDataAndSetState(data);
    this.api.onPageChange?.(page, pageSize);
  });

  /**
   * 主表pageSizeChange
   */
  public onShowSizeChange = action((page, pageSize) => {
    const data = {
      ...this.history,
      page,
      pageSize,
    };
    this.queryDataAndSetState(data);
    this.api.onShowSizeChange?.(page, pageSize);
  });

  /**
   * 主表查询事件，组合查询方案参数、重置所有
   */
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
