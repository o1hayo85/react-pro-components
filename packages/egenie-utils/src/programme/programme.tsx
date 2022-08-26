import { message, Modal } from 'antd';
import type { FilterItemsParams } from 'egenie-common';
import { FilterItems } from 'egenie-common';
import { action, computed, observable } from 'mobx';
import React from 'react';
import type { MainSubStructureModel } from '../egGrid';
import { request } from '../request';
import { DEFAULT_PROGRAMME, FILTER_ITEMS_COLLAPSE_PREFIX } from './constants';
import { formatFilterConfigData } from './formatFilterConfigData';
import { ProgrammeCountStore } from './programmeCountStore';
import { ProgrammeFilterItemsSettingStore } from './programmeFilterItemsSettingStore';
import { ProgrammeInteractiveStore } from './programmeInteractiveStore';
import type { SortAndDisplaySettingItem } from './sortAndDisplaySetting/types';
import type { FilterConfigData, ProgrammeListItem } from './types';

export interface ProgrammeParams extends FilterItemsParams {

  /**
   * 查询方案标识。必须传入、否则报错
   */
  moduleName: string;

  /**
   * 字典列表。需要和后端确认。字典需要从方案配置接口获取就传入、不需要就不传入(云仓不要传了)
   */
  dictList: string;

  /**
   * 类似字典列表(云仓不要传了)
   */
  itemList: string;

  /**
   * 字段的映射。后端的字典列表---> filterItems字段。返回的key和item的field不一致需要传入对应映射
   */
  fieldMap: {[key: string]: string | string[]; };

  /**
   * 表格配置
   */
  gridModel: MainSubStructureModel;

  /**
   * 查询方案数字角标
   */
  showProgrammeCount: boolean;
}

export class Programme {
  constructor(options: Partial<ProgrammeParams> = {}) {
    if (!options.moduleName) {
      throw new Error('moduleName必须传入');
    }

    // filterItems
    this.filterItems = new FilterItems({
      filterItems: (options.filterItems || []).map((item) => ({
        ...item,
        onPressEnter: this.handleSearch,
      })),
      dict: options.dict,
    });

    // 方案基本信息
    this.moduleName = options.moduleName;
    this.getProgrammeList(options.dictList, options.itemList, options.fieldMap);

    // 交互层面
    this.programmeInteractiveStore.collapsed = window.localStorage.getItem(`${FILTER_ITEMS_COLLAPSE_PREFIX}${this.moduleName}`) === 'true';

    // 查询项配置
    this.programmeFilterItemsSettingStore.getDefaultSetting();

    // 方案数量
    this.programmeCountStore.showProgrammeCount = Boolean(options.showProgrammeCount);
    this.programmeCountStore.getProgrammeCount();

    // gridModel
    this.gridModel = options.gridModel;
    this.gridModel.getFilterParams = () => this.filterItems.params;
  }

  public filterItems: FilterItems;

  public gridModel: MainSubStructureModel;

  public moduleName: string;

  @observable public programmeList: ProgrammeListItem[] = [];

  @observable public isSearch = false;

  public programmeFilterItemsSettingStore: ProgrammeFilterItemsSettingStore = new ProgrammeFilterItemsSettingStore(this);

  public programmeCountStore: ProgrammeCountStore = new ProgrammeCountStore(this);

  public programmeInteractiveStore: ProgrammeInteractiveStore = new ProgrammeInteractiveStore(this);

  @computed
  public get originSettingData(): SortAndDisplaySettingItem[] {
    return this.filterItems.originData.map((item) => ({
      primaryKey: item.field,
      label: item.label,
      showItem: item.showItem,
    }));
  }

  @observable public showAddProgramme = false;

  @action public handleShowAddProgramme = (showAddProgramme: boolean): void => {
    this.showAddProgramme = showAddProgramme;
  };

  @observable public activeProgrammeId = DEFAULT_PROGRAMME.id;

  @action private getProgrammeList = (dictList = '', itemList = '', fieldMap = {}): void => {
    request<FilterConfigData>({
      url: '/api/boss/baseinfo/rest/filterSet/config',
      method: 'post',
      data: {
        module: this.moduleName,
        dictList,
        itemList,
      },
    })
      .then((info) => {
        this.programmeList = info?.data?.oldSet || [];

        const list = formatFilterConfigData(info, fieldMap);
        this.filterItems.addDict(list.reduce((prev, current) => ({
          ...prev,
          [current.field]: current.data,
        }), {}));
        this.filterItems.updateFilterItem(list);
      });
  };

  @action public createProgramme = (params: { schemeName: string; }): Promise<unknown> => {
    const schemeValue = this.filterItems.actualData.filter((item) => !item.isDynamic)
      .reduce((prev, current) => ({
        ...prev,
        [current.field]: current.toProgramme(),
      }), {});
    return request({
      url: '/api/boss/baseinfo/rest/filterSet/queryScheme/save',
      method: 'post',
      data: {
        displaySetting: JSON.stringify({}),
        module: this.moduleName,
        schemeValue: JSON.stringify(schemeValue),
        schemeName: params.schemeName,
      },
    })
      .then(() => {
        message.success('创建成功');
        this.handleShowAddProgramme(false);
        this.getProgrammeList();
      });
  };

  @action public editProgramme = (): void => {
    const schemeValue = this.filterItems.actualData.filter((item) => !item.isDynamic)
      .reduce((prev, current) => ({
        ...prev,
        [current.field]: current.toProgramme(),
      }), {});

    Modal.confirm({
      content: '确认更新方案吗?',
      onOk: () => request({
        url: '/api/boss/baseinfo/rest/filterSet/queryScheme/save',
        method: 'post',
        data: {
          displaySetting: JSON.stringify({}),
          module: this.moduleName,
          schemeValue: JSON.stringify(schemeValue),
          schemeName: this.programmeList.find((item) => `${item.id}` === this.activeProgrammeId)?.schemeName,
          id: this.activeProgrammeId,
        },
      })
        .then(() => {
          message.success('编辑成功');
          this.getProgrammeList();
        }),
    });
  };

  @action public handleItemClick = (id: string) => {
    this.activeProgrammeId = `${id}`;
    const item = this.programmeList.find((val) => `${val.id}` == id);

    this.filterItems.reset();

    if (item && item.schemeValue) {
      try {
        const schemeValue = JSON.parse(item.schemeValue) || {};
        this.filterItems.originData.forEach((item) => {
          if (Object.prototype.hasOwnProperty.call(schemeValue, item.field)) {
            item.formatValue.call(item, schemeValue[item.field]);
          }
        });
      } catch (e) {
        console.log(e);
      }
    }

    this.handleSearch();
  };

  @action public handleItemDelete = (item: ProgrammeListItem) => {
    Modal.confirm({
      content: '确定删除吗?',
      onOk: () => request({
        url: '/api/boss/baseinfo/rest/filterSet/queryScheme/delete',
        method: 'post',
        data: {
          name: item.schemeName,
          module: this.moduleName,
          id: item.id,
        },
      })
        .then(action(() => {
          message.success('删除成功');
          if (this.activeProgrammeId === `${item.id}`) {
            this.activeProgrammeId = DEFAULT_PROGRAMME.id;
            this.filterItems.reset();
            this.handleSearch();
          }
          this.getProgrammeList();
        })),
    });
  };

  @action public handleSearch = () => {
    this.isSearch = true;

    this.filterItems.validator()
      .then(() => {
        try {
          return this.gridModel.onQuery();
        } catch (error) {
          console.log('error:筛选组件 handleSearch', error);
          return Promise.reject();
        }
      })
      .finally(() => this.isSearch = false);
  };
}

