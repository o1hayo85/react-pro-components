import { Cascader, Typography } from 'antd';
import _ from 'lodash';
import { action, extendObservable, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase } from './common';

export class FilterCascader extends FilterBase {
  constructor(options: Partial<FilterCascader>) {
    super(options);
    extendObservable(this, {
      toParams: this.toParams,
      ...options,
      showCollapse: false,
    });
    this.formatValue(this.value);
    this.snapshot = this.value;
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

  private snapshot = [];

  @action public reset = (): void => {
    this.value = this.snapshot;
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
  };

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
    } = this.props.store;
    return (
      <div
        className={`filterCascader ${className}`}
        style={toJS(style)}
      >
        <div
          className="filterLabel"
          title={label}
        >
          <Typography.Title
            ellipsis={{ rows: 1 }}
            title={label}
          >
            {label}
          </Typography.Title>
        </div>
        <Cascader
          allowClear={allowClear}
          bordered={false}
          disabled={disabled}
          onChange={onChange}
          options={data}
          placeholder={placeholder}
          showSearch={showSearch}
          value={value}
        />
      </div>
    );
  }
}
