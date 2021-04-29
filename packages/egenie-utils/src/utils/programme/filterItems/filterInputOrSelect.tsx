import { Input, Select, Typography } from 'antd';
import _ from 'lodash';
import { action, extendObservable, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase } from './common';
import styles from './filterItems.less';

export class FilterInputOrSelect extends FilterBase {
  constructor(options: Partial<FilterInputOrSelect>) {
    super(options);
    extendObservable(this, {
      toParams: this.toParams,
      ...options,
      showCollapse: false,
    });
    this.formatValue(this.value);
    this.snapshot = {
      value: this.value,
      selectValue: this.selectValue,
    };
  }

  /**
   * 类型标志
   */
  @observable public type: 'inputOrSelect' = ENUM_FILTER_ITEM_TYPE.inputOrSelect;

  public toProgramme(): string {
    if (this.selectValue != undefined) {
      return this.selectValue;
    } else {
      if (this.value) {
        return this.value;
      } else {
        return null;
      }
    }
  }

  public toParams(this: FilterInputOrSelect): {[key: string]: string; } {
    if (this.toProgramme() == undefined) {
      return {};
    } else {
      return { [this.field]: this.toProgramme() };
    }
  }

  private snapshot: { value: string; selectValue: string; } = {
    value: '',
    selectValue: '',
  };

  @action public reset = (): void => {
    this.value = this.snapshot.value;
    this.selectValue = this.snapshot.selectValue;
  };

  @action
  public formatValue(this: FilterInputOrSelect, value?: string): void {
    const item = this.data.find((item) => item.value === value);
    if (item) {
      this.selectValue = item.value;
      this.value = '';
    } else {
      this.value = _.toString(value);
      this.selectValue = undefined;
    }
  }

  /**
   * 输入的值
   */
  @observable public value = '';

  /**
   * @internal
   */
  @action public handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    this.value = event.target.value;
  };

  @observable public selectValue = '';

  /**
   * @internal
   */
  @action public handleSelectChange = (selectValue: string | undefined) => {
    this.selectValue = selectValue;
  };

  /**
   * 输入框提示文字
   */
  @observable public placeholder = '请输入';

  /**
   * 是否可清除
   */
  @observable public allowClear = true;
}

/**
 * @internal
 */
@observer
export class FilterInputOrSelectComponent extends React.Component<{ store: FilterInputOrSelect; }> {
  public handlePressEnter: React.KeyboardEventHandler = (event) => {
    if (typeof this.props.store.onPressEnter === 'function') {
      this.props.store.onPressEnter();
    }
  };

  render() {
    const {
      value,
      handleInputChange,
      placeholder,
      style,
      className,
      data,
      handleSelectChange,
      label,
      selectValue,
      allowClear,
    } = this.props.store;
    return (
      <div
        className={`${styles.filterInputOrSelect} ${className}`}
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
        <section>
          <Input
            allowClear={allowClear}
            bordered={false}
            onChange={handleInputChange}
            onPressEnter={this.handlePressEnter}
            placeholder={placeholder}
            value={value}
          />
          <Select
            allowClear
            bordered={false}
            dropdownMatchSelectWidth={false}
            onChange={handleSelectChange}
            options={data}
            placeholder="请选择"
            value={selectValue}
          />
        </section>
      </div>
    );
  }
}
