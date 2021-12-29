import { action, computed, extendObservable, intercept, observable, toJS } from 'mobx';
import { FilterBase } from './filterBase';
import type { ValueAndLabelData } from './types';
import { ENUM_FILTER_ITEM_TYPE } from './types';

function formatValue(oldValue: FilterSelect['value'], mode: FilterSelect['mode']): FilterSelect['value'] {
  if (mode) {
    if (Array.isArray(oldValue)) {
      return oldValue.map((item) => String(item));
    } else {
      return [];
    }
  } else {
    if (oldValue == null) {
      return undefined;
    } else {
      return String(oldValue);
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
    extendObservable(this, {
      ...rest,
      showCollapse: false,
    });
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

  public toParams(): {[key: string]: string; } {
    if (this.toProgramme() == null) {
      return {};
    } else {
      return { [this.field]: this.toProgramme() };
    }
  }

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
    if (this.mode) {
      if (Array.isArray(value)) {
        this.value = value;
      } else if (value == null) {
        this.value = [];
      } else {
        this.value = String(value)
          .split(',')
          .filter(Boolean);
      }
    } else {
      if (value == null) {
        this.value = undefined;
      } else {
        this.value = String(value);
      }
    }
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

  @observable public searchValue = '';

  /**
   * 最多显示数量
   */
  @observable public maxItemsLength = 1000;

  /**
   * 模式。默认单选、multiple为多选
   */
  @observable public mode: 'multiple' | undefined = undefined;

  @computed
  public get options(): ValueAndLabelData {
    return this.data.filter((item) => item.label.toLowerCase()
      .includes(this.searchValue.toLowerCase()))
      .slice(0, this.maxItemsLength);
  }

  /**
   * 是否显示下拉小箭头
   */
  @observable public showArrow = true;
}

