import _ from 'lodash';
import { action, computed, extendObservable, intercept, observable, toJS } from 'mobx';
import { FilterBase } from '../filterBase';
import type { ValueAndLabelData } from '../types';
import { ENUM_FILTER_ITEM_TYPE } from '../types';

function formatValue(value: FilterSelect['value'], mode: FilterSelect['mode']): FilterSelect['value'] {
  if (mode) {
    if (Array.isArray(value)) {
      return value.map((item) => String(item));
    } else if (typeof value === 'string' || typeof value === 'number') {
      return String(value)
        .split(',')
        .filter(Boolean);
    } else {
      return [];
    }
  } else {
    if (value == null) {
      return undefined;
    } else {
      return String(value);
    }
  }
}

export class FilterSelect extends FilterBase {
  constructor(options: Partial<FilterSelect>) {
    super(options);
    const {
      data,
      ...rest
    } = options;
    extendObservable(this, { ...rest });
    if (!this.placeholder) {
      this.placeholder = this.mode ? '请选择(可多选)' : '请选择';
    }
    this.formatValue(this.value);
    this.snapshot = toJS(this.value);

    intercept(this, 'value', (change) => {
      change.newValue = formatValue(change.newValue, this.mode);
      return change;
    });
  }

  /**
   * 类型标志
   */
  @observable public type: 'select' = ENUM_FILTER_ITEM_TYPE.select;

  public toProgramme(): string | null {
    if (this.mode) {
      if (Array.isArray(this.value) && this.value.length) {
        return this.value.join(',');
      } else {
        return null;
      }
    } else {
      if (this.value == null) {
        return null;
      } else {
        return String(this.value);
      }
    }
  }

  public toParams(): {[key: string]: string | string[]; } {
    if (this.toProgramme() == null) {
      return {};
    }

    if (this.mode && this.isParamList) {
      return { [this.field]: toJS(this.value) };
    } else {
      return { [this.field]: this.toProgramme() };
    }
  }

  /**
   * 是否将参数转化为Array,原来只支持转为string
   */
  @observable public isParamList = false;

  public translateParams(): string[] {
    if (this.toProgramme() == null) {
      return [];
    } else {
      return [
        this.label,
        [].concat(this.value)
          .map((item) => this.data.find((val) => val.value === item)?.label || '')
          .join(','),
      ];
    }
  }

  @action
  public formatValue(value?: string | undefined | string[]): void {
    this.value = formatValue(value, this.mode);
  }

  private snapshot: string | undefined | string[] = undefined;

  @action private handleCallback = () => {
    if (typeof this.onChangeCallback === 'function') {
      this.onChangeCallback(toJS(this.value));
    }
  };

  @action public reset = (): void => {
    this.value = this.snapshot;
    this.handleCallback();
  };

  /**
   * 选中值
   */
  @observable.ref public value: string | undefined | string[] = undefined;

  @action public onChange = (value: string | string[]) => {
    this.value = value;
    this.handleCallback();
  };

  /**
   * 值改变回掉
   */
  public onChangeCallback: (value?: string | string[] | undefined) => void;

  @action public onSearch = (searchValue: string) => {
    this.searchValue = typeof searchValue === 'string' ? searchValue : '';
    if (typeof this.onSearchCallback === 'function') {
      this.onSearchCallback(this.searchValue);
    }
  };

  /**
   * 搜索值改变回掉
   */
  public onSearchCallback: (value?: string) => void;

  /**
   * 是否禁止
   */
  @observable public disabled = false;

  /**
   * 是否可清除
   */
  @observable public allowClear = true;

  /**
   * 输入框提示文字
   */
  @observable public placeholder = '';

  /**
   * 是否可搜索
   */
  @observable public showSearch = true;

  /**
   * 是否可以选中全部。多选才能生效
   */
  @observable public showChooseAll = false;

  @observable public isLeftMatch = false;

  @action public handleLeftMatch = (isLeftMatch: boolean) => {
    this.isLeftMatch = isLeftMatch;
  };

  @observable public searchValue = '';

  /**
   * 最多显示数量
   */
  @observable public maxItemsLength = 500;

  /**
   * 模式。默认单选、multiple为多选
   */
  @observable public mode: 'multiple' | undefined = undefined;

  @computed
  public get options(): ValueAndLabelData {
    function handleSelectValue(mode: FilterSelect['mode'], value: FilterSelect['value']): Set<string> {
      if (mode === 'multiple') {
        return new Set(value);
      } else {
        return new Set(value == null ? [] : [value as string]);
      }
    }

    function handleAllMatchData(data: ValueAndLabelData, searchValue: string, isLeftMatch: boolean): ValueAndLabelData {
      return data.filter((item) => {
        if (selectValue.has(item.value)) {
          return true;
        }

        const text = (item.label || '').toLowerCase();
        const search = (searchValue || '').toLowerCase();
        if (isLeftMatch) {
          return _.startsWith(text, search);
        } else {
          return _.includes(text, search);
        }
      });
    }

    function handleValueMatch(data: ValueAndLabelData, maxItemsLength: number): number {
      let valueMatchLimit = 0;
      data.forEach((item, index) => {
        if (selectValue.has(item.value)) {
          if (valueMatchLimit < maxItemsLength) {
            valueMatchLimit++;
          } else {
            data[index] = null;
          }
        }
      });
      return valueMatchLimit;
    }

    function handleSearchMatch(data: ValueAndLabelData, valueMatchLimit: number, maxItemsLength: number) {
      let searchMatchCount = 0;
      data.forEach((item, index) => {
        if (item !== null && !selectValue.has(item.value)) {
          if (searchMatchCount + valueMatchLimit < maxItemsLength) {
            searchMatchCount++;
          } else {
            data[index] = null;
          }
        }
      });
    }

    const selectValue = handleSelectValue(this.mode, this.value);
    const allMatchData = handleAllMatchData(this.data, this.searchValue, this.isLeftMatch);
    handleSearchMatch(allMatchData, handleValueMatch(allMatchData, this.maxItemsLength), this.maxItemsLength);
    return allMatchData.filter(Boolean);
  }

  /**
   * 是否显示下拉小箭头
   */
  @observable public showArrow = true;
}

