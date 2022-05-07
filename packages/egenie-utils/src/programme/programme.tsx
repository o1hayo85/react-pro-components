import { message, Modal } from 'antd';
import type { FilterItemsParams } from 'egenie-common';
import { FilterItems } from 'egenie-common';
import { action, computed, observable } from 'mobx';
import React from 'react';
import type { MainSubStructureModel } from '../egGrid';
import type { BaseData } from '../request';
import { request } from '../request';
import type { FilterItemSettingItem } from './filterItemSetting';
import type { FilterConfigData } from './formatFilterConfigData';
import { formatFilterConfigData } from './formatFilterConfigData';

export const filterItemsCollapsePrefix = 'filterItemsCollapsePrefix_';
const filterItemsSettingPrefix = 'filterItemsSettingPrefix_';
const defaultProgrammeName = '默认方案';
const defaultProgramme = [
  {
    schemeName: defaultProgrammeName,
    schemeValue: JSON.stringify({}),
    displaySetting: JSON.stringify({}),
    sysSetting: true,
  },
];

function validParams(params?: Partial<ProgrammeParams>) {
  if (!params.moduleName) {
    throw new Error('moduleName必须传入');
  }
}

export interface ProgrammeListItem {
  id?: number;
  schemeName: string;
  schemeValue: string;
  displaySetting: string;
  sysSetting: boolean;
}

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
    validParams(options);

    // filterItems
    this.filterItems = new FilterItems({
      filterItems: (options.filterItems || []).map((item) => ({
        ...item,
        onPressEnter: this.handleSearch,
      })),
      dict: options.dict,
    });

    // programme
    this.moduleName = options.moduleName;
    this.showProgrammeCount = Boolean(options.showProgrammeCount);
    this.collapsed = window.localStorage.getItem(`${filterItemsCollapsePrefix}${this.moduleName}`) === 'true';
    this.getProgrammeList(options.dictList, options.itemList, options.fieldMap);
    this.getDefaultSetting();
    this.getProgrammeCount();

    // gridModel
    this.gridModel = options.gridModel;
    this.gridModel.getFilterParams = this.getParams;
  }

  @action private getParams = () => this.filterItems.params;

  @action private getProgrammeList = (dictList = '', itemList = '', fieldMap = {}) => {
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
        this.programmeList = defaultProgramme.concat(info?.data?.oldSet || []);

        const list = formatFilterConfigData(info, fieldMap);
        this.filterItems.addDict(list.reduce((prev, current) => ({
          ...prev,
          [current.field]: current.data,
        }), {}));
        this.filterItems.updateFilterItem(list);
      });
  };

  @action private handleSettingChange = (params: FilterItemSettingItem[]) => {
    this.filterItems.updateFilterItem(params);
    params.filter((item) => this.filterItems.originData.find((val) => val.field === item.field))
      .forEach((item, newPositionIndex) => {
        const oldPositionIndex = this.filterItems.originData.findIndex((val) => val.field === item.field);
        if (oldPositionIndex !== -1) {
          this.filterItems.swap(oldPositionIndex, newPositionIndex);
        }
      });
  };

  public gridModel: MainSubStructureModel;

  public moduleName: string;

  public showProgrammeCount = false;

  @observable public programmeCount: Record<string, number> = {};

  @observable public isProgrammeCountLoading = false;

  @action public getProgrammeCount = () => {
    if (this.showProgrammeCount) {
      this.isProgrammeCountLoading = true;
      request<BaseData<Record<string, number>>>({
        url: '/api/boss/baseinfo/rest/filterSet/count',
        method: 'post',
        data: { module: this.moduleName },
      })
        .then((info) => this.programmeCount = info.data || {})
        .finally(() => this.isProgrammeCountLoading = false);
    }
  };

  @observable public showProgramme = false;

  @action public handleShowProgramme = (showProgramme: boolean) => {
    this.showProgramme = showProgramme;
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
        this.handleShowProgramme(false);
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
          schemeName: this.activeProgramme,
          id: this.programmeList.find((item) => item.schemeName === this.activeProgramme)?.id,
        },
      })
        .then(() => {
          message.success('编辑成功');
          this.getProgrammeList();
        }),
    });
  };

  @observable public activeProgramme = defaultProgrammeName;

  @action public handleItemClick = (item: ProgrammeListItem) => {
    if (this.activeProgramme !== item.schemeName) {
      this.activeProgramme = item.schemeName;
      this.filterItems.reset();
      if (item.schemeValue) {
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
    }
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
        },
      })
        .then(action(() => {
          message.success('删除成功');
          if (this.activeProgramme === item.schemeName) {
            this.activeProgramme = defaultProgrammeName;
            this.filterItems.reset();
            this.handleSearch();
          }
          this.getProgrammeList();
        })),
    });
  };

  @observable public programmeList: ProgrammeListItem[] = defaultProgramme;

  @observable public collapsed: boolean;

  @action public handleCollapsed = () => {
    this.collapsed = !this.collapsed;
    window.localStorage.setItem(`${filterItemsCollapsePrefix}${this.moduleName}`, String(this.collapsed));
  };

  @observable public isSearch = false;

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

  @observable public showSetting = false;

  @action public handleShowSetting = (showSetting: boolean) => {
    this.showSetting = showSetting;
  };

  @action public getDefaultSetting = () => {
    request<BaseData<string>>({
      url: '/api/dashboard/cache/get',
      params: { cacheKey: `${filterItemsSettingPrefix}${this.moduleName}` },
    })
      .then((info) => {
        try {
          const data: FilterItemSettingItem[] = JSON.parse(info.data);
          if (Array.isArray(data)) {
            this.handleSettingChange(data);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  @action public handleSettingSave = (params: FilterItemSettingItem[]) => {
    return request({
      url: '/api/dashboard/cache/save',
      method: 'post',
      data: new URLSearchParams(Object.entries({
        cacheKey: `${filterItemsSettingPrefix}${this.moduleName}`,
        cacheValue: JSON.stringify(params.map((item) => {
          const newItem = { ...item };

          // 不保存label
          delete newItem.label;
          return newItem;
        })),
      })),
    })
      .then(() => {
        this.handleShowSetting(false);
        this.handleSettingChange(params);
        this.handleSearch();
      });
  };

  public filterItems: FilterItems;

  @computed
  public get originSettingData(): FilterItemSettingItem[] {
    return this.filterItems.originData.map((item) => ({
      field: item.field,
      label: item.label,
      showItem: item.showItem,
      showCollapse: item.showCollapse,
      isCollapse: item.isCollapse,
    }));
  }

  public scrollContainerRef = React.createRef<HTMLDivElement>();

  /**
   * 是否显示滚动提示框
   */
  @observable public showScroll = false;

  @action public handleScroll = () => {
    this.showScroll = true;
  };

  @action public clickCloseScroll = () => {
    this.showScroll = false;
  };

  @action public clickPreventCloseScroll = (event) => {
    event.stopPropagation();
    this.showScroll = true;
  };
}

