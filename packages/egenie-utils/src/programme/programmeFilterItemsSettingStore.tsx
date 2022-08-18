import type { FilterItem } from 'egenie-common';
import { action, observable } from 'mobx';
import type { BaseData } from '../request';
import { request } from '../request';
import { FILTER_ITEMS_SETTING_PREFIX } from './constants';
import type { Programme } from './programme';
import type { SortAndDisplaySettingItem } from './sortAndDisplaySetting/types';

export class ProgrammeFilterItemsSettingStore {
  constructor(private parent: Programme) {
  }

  @action private handleSettingChange = (settingData: SortAndDisplaySettingItem[]) => {
    this.parent.filterItems.updateFilterItem(settingData);

    const settingMatchFields: string[] = settingData.filter((item) => this.parent.filterItems.originData.find((val) => val.field === item.field))
      .map((item) => item.field);
    const settingMatchFilterItems: FilterItem[] = [];
    const restFilterItems: FilterItem[] = [];

    settingMatchFields.forEach((field) => {
      settingMatchFilterItems.push(this.parent.filterItems.originData.find((item) => item.field === field));
    });

    this.parent.filterItems.originData.forEach((item) => {
      if (!settingMatchFields.includes(item.field)) {
        restFilterItems.push(item);
      }
    });

    let i = 0;
    let j = 0;
    while (i < settingMatchFilterItems.length) {
      this.parent.filterItems.originData[i] = settingMatchFilterItems[i];
      i++;
    }

    while (j < restFilterItems.length) {
      this.parent.filterItems.originData[i] = restFilterItems[j];
      i++;
      j++;
    }
  };

  @action public getDefaultSetting = (): void => {
    request<BaseData<string>>({
      url: '/api/dashboard/cache/get',
      params: { cacheKey: `${FILTER_ITEMS_SETTING_PREFIX}${this.parent.moduleName}` },
    })
      .then((info) => {
        try {
          const data: SortAndDisplaySettingItem[] = JSON.parse(info.data);
          if (Array.isArray(data)) {
            this.handleSettingChange(data);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  @action public handleSettingSave = (params: SortAndDisplaySettingItem[]) => {
    return request({
      url: '/api/dashboard/cache/save',
      method: 'post',
      data: new URLSearchParams(Object.entries({
        cacheKey: `${FILTER_ITEMS_SETTING_PREFIX}${this.parent.moduleName}`,
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
        this.parent.handleSearch();
      });
  };

  @observable public showSetting = false;

  @action public handleShowSetting = (showSetting: boolean) => {
    this.showSetting = showSetting;
  };
}
