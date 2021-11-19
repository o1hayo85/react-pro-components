import { message } from 'antd';
import { observable, action, computed, set, toJS } from 'mobx';
import type { IObservableObject } from 'mobx';
import type { IObj, IEgGridModel, IEgGridApi, StrOrNum } from '../egGridModel';
import { EgGridModel } from '../egGridModel';
import type { MainSubStructureModel, IButton } from './mainSubStructureModel';

import type { SubTableListModel } from './subTableListModel';

export interface ICustomModel {
  [key: string]: any;
}
export type TCustomModel = ICustomModel | IObservableObject;
export interface ISubTableModel {
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
  allFilterItemsInOneGroup?: boolean;
  clearAfterChangeFilterItem?: boolean;
  buttons?: (subTable: SubTableModel) => IButton[];
  filterItems?: IFilterItems[];
}

type INumOrStr = string | number | string[] | number[];
export interface IFilterItems {
  label: string;
  field: string;
  value?: INumOrStr;
  type?: 'select' | 'input';
  options?: Array<{ label: string; value: INumOrStr; }>;
}

export class SubTableModel {
  /**
   * parent为子表list
   */
  @observable public parent: Partial<SubTableListModel> = {};

  /**
   * 顶层主子表Model
   */
  @observable public top: Partial<MainSubStructureModel> = {};

  /**
   * 是否展示子表
   */
  @observable public showSubTable: true;

  @observable public tab = {
    name: '',
    value: '',
  };

  /**
  * 子表gridModel
  */
  @observable public grid?: IEgGridModel;

  /**
   * 子表api，同gridModel的api
   */
  @observable public api: IEgGridApi = {};

  /**
   * 子表是否为表格
   */
  @observable public notGrid = false;

  /**
   * 存储上次查询参数
   */
  @observable public history: IObj = {};

  /**
   * 子表gridModel
   */
  @observable public gridModel: EgGridModel;

  /**
   * 自定义子表
   */
  @observable public isCustom: boolean;

  /**
   * 自定义子表的model
   */
  @observable public customModel: ICustomModel;

  /**
   * 自定义View
   */
  public CustomView: React.ReactNode;

  /**
   * 子表查询按钮组
   */
  @observable public buttons?: IButton[];

  /**
   * 子表查询条件
   */
  @observable public filterItems?: IFilterItems[];

  /**
   * 是否组合查询
   */
  @observable public allFilterItemsInOneGroup?: boolean = true;

  /**
   * 改变条件后是否清空
   */
  @observable public clearAfterChangeFilterItem?: boolean = false;

  /**
   * 当前选择的查询条件
   */
  @observable public cursorFilterItemField?: string = '';

  /**
   * 当前已选择条件的数量
   */
  @computed public get numOfHasValue(): number {
    return this.filterItems?.reduce((res, el) => Number(Boolean(el.value)) + res, 0);
  }

  /**
   * 获取查询数据
   */
  @computed public get searchData(): ICustomModel {
    return this.filterItems?.reduce((data, item) => {
      data[item.field] = `${item.value }`;
      return data;
    }, {});
  }

  /**
   * 获取当前查询项
   */
  @computed public get cursorFilterItem(): IFilterItems {
    return this.filterItems?.find(({ field }) => field === this.cursorFilterItemField);
  }
  
  /**
   * 是否为当前tab
   */
  @computed public get isCursor(): boolean {
    return this.parent.activeTab === this.tab.value;
  }

  /**
   * 是否初始化过
   */
  @computed public get isInited(): StrOrNum {
    return this.parent.tabsFlag.inited[this.tab.value];
  }

  @computed public get isSearched(): StrOrNum {
    return this.parent.tabsFlag.searched[this.tab.value];
  }

  @computed public get buttonsPassPermissionValidate() {
    if (!this.buttons.length) {
      return this.buttons;
    }
    const { permissionOfButton } = this.top;
    const buttons = this.buttons.map((el, idx) => {
      // 给group按钮加idx属性
      const { group } = el;
      if (!group) {
        return { ...el };
      }
      const ret = {
        ...el,
        idx: 0,
      };
      ret.group = ret.group.map((el, index) => ({
        ...el,
        idx: index + 1,
      }));
      console.log('group的idx-------:', ret);
      return ret;
    });
    if (!permissionOfButton) {
      return buttons;
    } // 没有权限控制，则全部显示
    return buttons
      .filter((el) => {
        const { permissionId, group } = el;

        // group留给下一步处理
        if (group) {
          return true;
        }

        // 没有permissionId字段说明不受权限影响
        if (!permissionId) {
          return true;
        }
        return permissionOfButton.indexOf(permissionId) !== -1;
      })
      .map((button) => {
        const { group, ...firstButton } = button;
        if (!group) {
          return button;
        }
        const _group = toJS(group.slice(0));

        // 先把group放到同一个arr中
        _group.unshift(firstButton);

        // 过滤掉没权限的
        const arr = _group.filter((el) => (el.permissionId == null || (permissionOfButton.indexOf(el.permissionId) !== -1)));

        // 如果都没权限，返回false，留给下一步再过滤掉
        if (!arr.length) {
          return false;
        }
        const ret = arr.shift(); // 提出第一项为主按钮
        if (!arr.length) {
          return ret;
        } // 如果剩余的是空数组，直接返回第一项作为按钮而不是按钮组
        ret.group = arr; // 否则把剩余arr的装配个ret
        return ret;
      })
      .filter((button) => button); // 过滤掉false
  }

  @computed public get _buttons() {
    // 最终页面展示的buttons，跟cashRows联动
    const {
      buttonsPassPermissionValidate,
    } = this;

    // 如果没有cashRows就不处理直接返回,这种处理方式被废弃
    if (!buttonsPassPermissionValidate.length) {
      return buttonsPassPermissionValidate;
    }
    
    const {
      gridModel: { selectRows },
    } = this;

    return buttonsPassPermissionValidate.map((button: IButton) => {
      const { group, ...firstButton } = button;
      const { display } = button;
      if (!group) {
        if (group) {
          return button;
        } // group留给下一步处理
        if (!display) {
          return button;
        }
        if (typeof display !== 'function') {
          return button;
        } // 如果没有display方法或者display不合法，那么就跟主按钮一起显隐
        return {
          ...button,
          disabled: !display(selectRows),
        };
      }
      const _group = toJS(group.slice(0));
      _group.unshift(firstButton); // 先把gourp放到同一个arr中
      const arr = _group.map((button) => {
        // 设置disabled
        const { display } = button;
        if (!display) {
          return button;
        }
        if (typeof display !== 'function') {
          return button;
        } // 如果没有display方法或者display不合法，那么就跟主按钮一起显隐
        return {
          ...button,
          disabled: !display(selectRows),
        };
      });
      const idx = arr.findIndex((el) => !el.disabled); // 第一个可用的坐标
      if (!~idx) {
        return {
          ...arr[0],
          group: arr.slice(1),
        };
      } // 全禁用，则以最初的第一按钮显示，并禁用
      const item = arr.splice(idx, 1)[0];
      item.group = arr;
      if (item.isLabel && !~arr.findIndex((el) => !el.disabled)) {
        item.disabled = true;
      } // 如果剩余全禁用，第一个又只是label则全禁用
      return item;
    });
  }

  constructor(options: ISubTableModel) {
    set(this, { ...(options || {}) });
    const { onSort, onRowClick, onRefresh, handlePageChange, onShowSizeChange } = this;
    if (options.isCustom) {
      this.CustomView = options.customView;
    } else {
      const { onToggleOrDeleteSubRow, onMouseInRow, onMouseOutRow } = (options.api || {});
      this.gridModel = new EgGridModel({
        ...options.grid,
        columns: options.grid.getColumns?.(this.top, this) ?? options.grid.columns,
        api: {
          onPageChange: handlePageChange,
          onShowSizeChange,
          onSort, // 排序
          onRowClick, // 行点击
          onRefresh,
          onToggleOrDeleteSubRow,
          onMouseInRow,
          onMouseOutRow,
        },
        parent: this,
      });
    }
    this.buttons = options.buttons?.(this) ?? [];
    set(this, {
      history: {
        pageSize: options.grid?.pageSize || 50,
        sidx: '',
        sord: 'asc',
        page: 1,
      },
    });
    this.api.onQuery = this.requestOry(this.api.onQuery);

    // TODO: 装备子表查询条件的options,比如采用公共字典项
  }

  // 子表查询值改变
  public onFilterValueChange = action((key, value) => {
    console.log(key, value);
    if (this.allFilterItemsInOneGroup) {
      return this.cursorFilterItem && (this.cursorFilterItem.value = value);
    }
    const item = this.filterItems.find((el) => el.field === key);
    if (item) {
      item.value = value;
    }
  });

  // 子表查询项改变
  public onCursorFilterItemFieldChange = action((field) => {
    const { clearAfterChangeFilterItem, cursorFilterItem } = this;
    if (clearAfterChangeFilterItem && cursorFilterItem) {
      cursorFilterItem.value = '';
    }
    this.cursorFilterItemField = field;
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

  // 子表查询按钮点击调用
  public onSearch = action(() => {
    if (this.gridModel && Object.keys(this.gridModel).length) {
      this.gridModel.resetAllSelectedRows(); // 重置表头的勾选框
      this.gridModel.loading = true;
      const data = this.searchData;
      console.log(data, '点击子表搜索1');
      const page = '1';
      const { pageSize = '50', sidx, sord } = this.history;
      if (!this.gridModel.showPager) {
        this.queryDataAndSetState({ cond: data });
      } else {
        this.queryDataAndSetState({
          cond: data,
          page,
          pageSize,
          sidx,
          sord,
        });
      }
    } else {
      const data = this.searchData;
      console.log(data, '点击子表搜索2');
      const page = '1';
      const { pageSize = '50', sidx, sord } = this.history;
      this.queryDataAndSetState({
        cond: data,
        page,
        pageSize,
        sidx,
        sord,
      });
    }
  });

  // 主表点击行调用查询
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
            this.api.callbackAfterQuery?.(this);
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

  public getDisplayValueOfFilterItem(item) {
    // 渲染子表查询条件model
    if (!item) {
      return '';
    }
    const { type, value, options } = item;
    if (type === 'select') {
      return (options.find((el) => el.value === value) || {}).label || '';
    }
    return value || '';
  }

  /**
   * 包装子表的查询接口，如果快速多次调用查询接口，忽略前边的请求，只接受最后一个请求返回的数据
   */
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
