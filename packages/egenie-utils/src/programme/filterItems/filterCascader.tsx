import { Cascader } from 'antd';
import _ from 'lodash';
import { action, intercept, observable, extendObservable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase, FilterItemLabel, ValueAndLabelData } from './common';

export class FilterCascader extends FilterBase {
  constructor(options: Partial<FilterCascader>) {
    super(options);
    const {
      data,
      ...rest
    } = options;

    extendObservable(this, {
      ...rest,
      showCollapse: false,
    });
    this.formatValue(this.value);
    this.snapshot = this.value;

    intercept(this, 'value', (change) => {
      change.newValue = Array.isArray(change.newValue) ? change.newValue : [];
      return change;
    });
  }

  /**
   * 类型标志
   */
  @observable public type: 'cascader' = ENUM_FILTER_ITEM_TYPE.cascader;

  public toProgramme(): string | null {
    if (Array.isArray(this.value) && this.value.length) {
      return this.value.join(',');
    } else {
      return null;
    }
  }

  public toParams(this: FilterCascader): {[key: string]: string; } {
    if (this.toProgramme()) {
      return { [this.field]: this.toProgramme() };
    } else {
      return {};
    }
  }

  public translateParams(this: FilterCascader): string {
    if (Array.isArray(this.value) && this.value.length) {
      const translatePath: string[] = [];
      let currentData = this.data;
      for (let i = 0; i < this.value.length; i++) {
        const item = currentData.find((val) => val.value === this.value[i]);
        if (item) {
          currentData = item.children || [];
          translatePath.push(item.label);
        } else {
          currentData = [];
          translatePath.push('');
        }
      }

      return `${this.label}:${translatePath.join(',')}`;
    } else {
      return '';
    }
  }

  @action
  public formatValue(this: FilterCascader, value?: string[] | string): void {
    if (Array.isArray(value)) {
      this.value = value;
    } else {
      this.value = _.toString(value)
        .split(',')
        .filter(Boolean);
    }
  }

  private snapshot: string[] = [];

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
   * 选择的值
   */
  @observable public value: string[] = [];

  /**
   * @internal
   */
  @action public onChange = (value: string[]) => {
    if (Array.isArray(value)) {
      this.value = value;
    } else {
      this.value = [];
    }

    this.handleCallback();
  };

  /**
   * 动态加载选项
   */
  public loadData: (selectedOptions) => void;

  /**
   * 值改回掉
   */
  public onChangeCallback: (value?: string[]) => void;

  /**
   * 输入框提示文字
   */
  @observable public placeholder = '请选择';

  /**
   * 是否可清除
   */
  @observable public allowClear = true;

  /**
   * 是否禁止
   */
  @observable public disabled = false;

  /**
   * 是否显示搜索框
   */
  @observable public showSearch = true;

  /**
   * 自定义 options 中 label name children 的字段
   */
  @observable public fieldNames: { value: string; label: string; children: string; } = {
    label: 'label',
    value: 'value',
    children: 'children',
  };
}

/**
 * @internal
 */
@observer
export class FilterCascaderComponent extends React.Component<{ store: FilterCascader; }> {
  render() {
    const {
      value,
      data,
      onChange,
      placeholder,
      allowClear,
      disabled,
      style,
      className,
      label,
      showSearch,
      loadData,
      fieldNames,
      labelWidth,
      required,
    } = this.props.store;
    return (
      <div
        className={`filterCascader ${className}`}
        style={toJS(style)}
      >
        <FilterItemLabel
          label={label}
          labelWidth={labelWidth}
          required={required}
        />
        <Cascader
          allowClear={allowClear}
          bordered={false}
          disabled={disabled}
          fieldNames={fieldNames}
          loadData={loadData}
          onChange={onChange}
          options={toJS(data)}
          placeholder={placeholder}
          showSearch={showSearch}
          value={value}
        />
      </div>
    );
  }
}
