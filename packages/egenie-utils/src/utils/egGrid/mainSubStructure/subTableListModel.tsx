import { set, observable, action, computed } from 'mobx';
import type { IObj } from '../egGridModel';
import { MainSubStructureModel } from './mainSubStructureModel';
import type { ISubTableModel } from './subTableModel';
import { SubTableModel } from './subTableModel';

export interface ISubTableListModel {
  top?: MainSubStructureModel;
  activeTab?: string;
  tabsFlag?: {
    inited?: IObj;
    searched?: IObj;
  };
  list?: ISubTableModel;
}

export class SubTableListModel {
  @observable public activeTab = '';

  @observable public tabsFlag = {
    inited: {},
    searched: {},
  };

  @observable public top: Partial<MainSubStructureModel> = {};

  @observable public list = [];

  @observable public listModel = [];

  @computed public get cursorTabModel() {
    return this.listModel.find((el) => el.tab.value === this.activeTab);
  }

  constructor({ ...options }: ISubTableListModel) {
    set(this, { ...(options || {}) });
    this.setListModel(this.list);
  }

  public onClickTab = action((tabName: string) => {
    this.activeTab = tabName;
    const {
      tabsFlag: { inited, searched },
    } = this;
    this.tabsFlag.inited = {
      ...inited,
      [tabName]: true,
    }; // 初始化开关开，查询开关由内部的subTableModel设置，只要查了就设置
    if (!searched[tabName]) {
      // 如果该页签在最近一次行点击后还未获取过数据，那么search，在子表查询中会更改这里的searched状态，都点击一遍之后这里将都是true,之后不再执行
      if (this.cursorTabModel) {
        this.cursorTabModel.onQuery();
      }
    }
  });

  public setListModel = action((list) => {
    this.listModel = list.map((el) => {
      return new SubTableModel({
        ...el,
        parent: this,
        top: this.top,
      });
    }, this);
  });
}
