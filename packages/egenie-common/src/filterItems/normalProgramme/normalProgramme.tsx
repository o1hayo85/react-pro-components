import { action, computed, observable } from 'mobx';
import type React from 'react';
import { FormatDateType } from '../filterDate/filterDate';
import type { FilterItemsParams } from '../filterItems';
import { FilterItems } from '../filterItems';
import { ENUM_FILTER_ITEM_TYPE } from '../types';
import type { FilterItem } from '../types';

interface FilterItemTransformItem {
  filterItem: FilterItem;

  /**
   * 某项所占位置多少个
   */
  itemCount: number;
}

export interface NormalProgrammeParams extends FilterItemsParams {

  /**
   * 回车、查询回调
   */
  handleSearch?: (...args: any) => Promise<any>;

  /**
   * 一行显示个数
   */
  count?: number;

  /**
   * 自定义的button。会覆盖默认的重置、查询
   */
  button?: React.ReactNode;

  /**
   * 是否显示button
   */
  showButton?: boolean;
}

export class NormalProgramme {
  constructor(options: Partial<NormalProgrammeParams> = {}) {
    this.filterItems = new FilterItems({
      filterItems: (options.filterItems || []).map((item) => ({
        onPressEnter: this.handleSearch,
        ...item,
      })),
      dict: options.dict,
    });

    this.searchCallback = options.handleSearch;

    if (options.count) {
      this.count = options.count >>> 0;
    }

    if (options.button) {
      this.button = options.button;
    }

    if (options.showButton != null) {
      this.showButton = options.showButton;
    }
  }

  private searchCallback: NormalProgrammeParams['handleSearch'];

  @observable public isSearch = false;

  @action public handleSearch = () => {
    this.isSearch = true;

    this.filterItems.validator()
      .then(() => {
        if (typeof this.searchCallback === 'function') {
          try {
            return this.searchCallback();
          } catch (error) {
            console.log('error:筛选组件 handleSearch', error);
            return Promise.reject();
          }
        } else {
          return Promise.resolve();
        }
      })
      .finally(() => this.isSearch = false);
  };

  /**
   * 查询项instance
   */
  public filterItems: FilterItems;

  @observable public count = 4;

  /**
   * 自定义的button。会覆盖默认的重置、查询
   */
  public button: NormalProgrammeParams['button'] = null;

  @observable public showButton = true;

  @action public reset = () => {
    this.filterItems.reset();
  };

  @computed
  public get notCollapseData(): FilterItemTransformItem[] {
    let notIncludedBtnCount = 2 * this.count - 1;
    const result: FilterItemTransformItem[] = [];

    for (let i = 0; i < this.filterItems.actualData.length && notIncludedBtnCount > 0; i++) {
      const item = this.filterItems.actualData[i];
      const isDateComponentNeedDoubleCount = (item.type === ENUM_FILTER_ITEM_TYPE.date || item.type === ENUM_FILTER_ITEM_TYPE.dateRange) &&
        item.format === FormatDateType.defaultFormat &&
        this.count >= 6;

      if (isDateComponentNeedDoubleCount) {
        if (notIncludedBtnCount >= 2) {
          result.push({
            filterItem: item,
            itemCount: 2,
          });
        }
        notIncludedBtnCount -= 2;
      } else {
        if (notIncludedBtnCount >= 1) {
          result.push({
            filterItem: item,
            itemCount: 1,
          });
        }
        notIncludedBtnCount -= 1;
      }
    }

    return result;
  }

  @computed
  public get notCollapseActualBtnCount(): number {
    const notCollapseActualTotalCount = this.notCollapseData.reduce((prev, current) => prev + current.itemCount, 0);
    return this.count - (notCollapseActualTotalCount % this.count);
  }

  @computed
  public get collapseData(): FilterItemTransformItem[] {
    const notCollapseFields = this.notCollapseData.map((item) => item.filterItem.field);
    return this.filterItems.actualData.filter((item) => !notCollapseFields.includes(item.field))
      .map((filterItem) => ({
        filterItem,
        itemCount: 1,
      }));
  }
}

