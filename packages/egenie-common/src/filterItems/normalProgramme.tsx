import { action, observable } from 'mobx';
import type React from 'react';
import type { FilterItemsParams } from './filterItems';
import { FilterItems } from './filterItems';

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
    const initFilterItems = () => {
      this.filterItems = new FilterItems({
        filterItems: (options.filterItems || []).map((item) => ({
          ...item,
          onPressEnter: this.handleSearch,
        })),
        dict: options.dict,
      });

      this.searchCallback = options.handleSearch;

      if (options.count) {
        this.count = options.count;
      }

      if (options.button) {
        this.button = options.button;
      }

      if (options.showButton != null) {
        this.showButton = options.showButton;
      }
    };

    initFilterItems();
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
}

