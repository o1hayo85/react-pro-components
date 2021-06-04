import { action, computed, observable, set } from 'mobx';
import qs from 'qs';
import React from 'react';
import { FilterItemSettingItem } from '../filterItemSetting';
import { ENUM_FILTER_ITEM_TYPE, FilterItem, FilterItemOptions, formatValueAndLabelData, ValueAndLabelData } from './common';
import { FilterCascader, FilterCascaderComponent } from './filterCascader';
import { FilterCheckbox, FilterCheckboxComponent } from './filterCheckbox';
import { FilterDate, FilterDateComponent } from './filterDate';
import { FilterDateStartOrEnd, FilterDateStartOrEndComponent } from './filterDateStartOrEnd';
import { FilterInput, FilterInputComponent } from './filterInput';
import { FilterInputAndSelect, FilterInputAndSelectComponent } from './filterInputAndSelect';
import { FilterInputNumberGroup, FilterInputNumberGroupComponent } from './filterInputNumberGroup';
import { FilterInputOrSelect, FilterInputOrSelectComponent } from './filterInputOrSelect';
import { FilterRadio, FilterRadioComponent } from './filterRadio';
import { FilterSelect, FilterSelectComponent } from './filterSelect';
import { FilterTreeSelect, FilterTreeSelectComponent } from './filterTreeSelect';

function validParams(data: FilterItemOptions[]) {
  data.forEach((item) => {
    if (!(item.type in ENUM_FILTER_ITEM_TYPE)) {
      throw new Error(`当前type: ${item.type}。只支持${Object.values(ENUM_FILTER_ITEM_TYPE)
        .join('或者')}`);
    }

    if (!item.field) {
      throw new Error(`${item.type}的field必须填写`);
    }

    if (!item.label) {
      throw new Error(`${item.field}的label必须填写`);
    }
  });

  if (data.length) {
    const fields = Object.create(null);
    const labels = Object.create(null);

    data.forEach((item) => {
      fields[item.field] = (fields[item.field] >>> 0) + 1;
      labels[item.field] = (labels[item.field] >>> 0) + 1;
    });

    data.forEach((item) => {
      if (fields[item.field] > 1) {
        throw new Error(`field: ${item.field} 重复`);
      }
      if (labels[item.field] > 1) {
        throw new Error(`label: ${item.label} 重复`);
      }
    });
  }
}

// @ts-ignore
function filterInstanceFactory(item: FilterItemOptions): FilterItem {
  switch (item.type) {
    case ENUM_FILTER_ITEM_TYPE.input:
      return new FilterInput(item);
    case ENUM_FILTER_ITEM_TYPE.inputNumberGroup:
      return new FilterInputNumberGroup(item);
    case ENUM_FILTER_ITEM_TYPE.select:
      return new FilterSelect(item);
    case ENUM_FILTER_ITEM_TYPE.radio:
      return new FilterRadio(item);
    case ENUM_FILTER_ITEM_TYPE.inputAndSelect:
      return new FilterInputAndSelect(item);
    case ENUM_FILTER_ITEM_TYPE.date:
    case ENUM_FILTER_ITEM_TYPE.dateRange:
      return new FilterDate(item);
    case ENUM_FILTER_ITEM_TYPE.dateStart:
    case ENUM_FILTER_ITEM_TYPE.dateEnd:
      return new FilterDateStartOrEnd(item);
    case ENUM_FILTER_ITEM_TYPE.checkbox:
      return new FilterCheckbox(item);
    case ENUM_FILTER_ITEM_TYPE.inputOrSelect:
      return new FilterInputOrSelect(item);
    case ENUM_FILTER_ITEM_TYPE.cascader:
      return new FilterCascader(item);
    case ENUM_FILTER_ITEM_TYPE.treeSelect:
      return new FilterTreeSelect(item);
  }
}

/**
 * @internal
 */
export function filterComponentFactory(item: FilterItem): React.ReactNode {
  switch (item.type) {
    case ENUM_FILTER_ITEM_TYPE.input:
      return (
        <FilterInputComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.inputNumberGroup:
      return (
        <FilterInputNumberGroupComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.select:
      return (
        <FilterSelectComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.radio:
      return (
        <FilterRadioComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.inputAndSelect:
      return (
        <FilterInputAndSelectComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.date:
    case ENUM_FILTER_ITEM_TYPE.dateRange:
      return (
        <FilterDateComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.dateStart:
    case ENUM_FILTER_ITEM_TYPE.dateEnd:
      return (
        <FilterDateStartOrEndComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.checkbox:
      return (
        <FilterCheckboxComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.inputOrSelect:
      return (
        <FilterInputOrSelectComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.cascader:
      return (
        <FilterCascaderComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.treeSelect:
      return (
        <FilterTreeSelectComponent
          key={item.field}
          store={item}
        />
      );
    default:
      return null;
  }
}

function transformUrlQuery(instance: FilterItem): void {
  const urlParams = qs.parse(location.search.replace(/^\?/, ''));
  if (Object.prototype.hasOwnProperty.call(urlParams, instance.field)) {
    instance.formatValue.call(instance, urlParams[instance.field]);
  }
}

function transformDict(dict: FilterItemsParams['dict'], instance: FilterItem): void {
  if (Object.prototype.hasOwnProperty.call(dict, instance.field)) {
    instance.handleData(dict[instance.field]);
  }
}

function transformDataToInstance(dict, data): FilterItem[] {
  validParams(data);

  return data.map((item) => {
    const instance = filterInstanceFactory(item);

    transformUrlQuery(instance);
    transformDict(dict, instance);
    return instance;
  });
}

export interface FilterItemsParams {

  /**
   * 查询项配置
   */
  filterItems: FilterItemOptions[];

  /**
   * 字典
   */
  dict: {[key: string]: ValueAndLabelData; };
}

export interface ConnectListItem {
  toParams: () => {[key: string]: string; };
  reset?: () => void;
}

export class FilterItems {
  constructor({
    filterItems = [],
    dict = {},
  }: Partial<FilterItemsParams>) {
    this.init(filterItems, dict);
  }

  /**
   *字典。key，value格式
   */
  @observable public dict: FilterItemsParams['dict'] = {};

  /**
   * @internal
   */
  public initSettingData: FilterItemSettingItem[] = [];

  @action private init = (data: FilterItemOptions[], dict: FilterItemsParams['dict']): void => {
    for (const key in dict) {
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        this.dict[key] = formatValueAndLabelData(dict[key]);
      }
    }
    this.originData = transformDataToInstance(dict, data);
    this.initSettingData = this.originData.filter((item) => !item.isDynamic)
      .map((item) => ({
        field: item.field,
        label: item.label,
        showItem: item.showItem,
        showCollapse: item.showCollapse,
        isCollapse: item.isCollapse,
      }));
  };

  /**
   * @internal
   */
  @action public swap = (oldIndex: number, newIndex: number) => {
    if (oldIndex >= 0) {
      if (oldIndex < this.originData.length) {
        if (newIndex >= 0) {
          if (newIndex < this.originData.length) {
            const tmp = this.originData[oldIndex];
            this.originData[oldIndex] = this.originData[newIndex];
            this.originData[newIndex] = tmp;
          }
        }
      }
    }
  };

  /**
   * 动态添加item。field、label、type必须
   * @param data item数据
   */
  @action public addItem = (data: FilterItemOptions[]): void => {
    transformDataToInstance(this.dict, data)
      .forEach((item) => {
        item.isDynamic = true;
        this.originData.push(item);
      });
  };

  /**
   * 动态添加字典
   * @param dict 字典数据
   */
  @action public addDict = (dict: FilterItemsParams['dict']): void => {
    for (const key in dict) {
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        this.dict[key] = formatValueAndLabelData(dict[key]);
      }
    }
    this.originData.forEach((instance) => transformDict(dict, instance));
  };

  /**
   * 重置所有item的值为construct时的状态
   */
  @action public reset = (): void => {
    this.originData.forEach((item) => item.reset());
    this.connectedList.forEach((item) => {
      if (typeof item.reset === 'function') {
        item.reset();
      }
    });
  };

  /**
   * 更新item的值。filed必须、type建议写、其它需要更新的字段
   * @param data 更新数据
   */
  @action public updateFilterItem = (data: FilterItemOptions[]): void => {
    this.originData.forEach((item) => {
      const addItem = data.find((val) => val.field === item.field);
      if (addItem) {
        set(item, addItem);
      }
    });
  };

  /**
   * 获取某一项查询项
   */
  public getFilterItem(field: string): FilterItem | undefined {
    return this.originData.find((item) => item.field === field);
  }

  /**
   * @internal
   */
  @observable public originData: FilterItem[] = [];

  /**
   * @internal
   */
  @computed
  public get actualData() {
    return this.originData.filter((item) => item.showItem);
  }

  /**
   * 获取查询项的参数
   */
  @computed
  public get params(): {[key: string]: string; } {
    const params = this.actualData.reduce((prev, current) => ({
      ...prev,
      ...current.toParams.call(current),
    }), {});

    return this.connectedList.reduce((prev, current) => ({
      ...prev,
      ...current.toParams(),
    }), params);
  }

  /**
   * 连接的列表
   */
  @observable private connectedList: ConnectListItem[] = [];

  /**
   * 外部model连接到查询项。如左侧tree
   */
  @action
  public connect(connectListItem: ConnectListItem) {
    this.connectedList.push(connectListItem);
  }
}
