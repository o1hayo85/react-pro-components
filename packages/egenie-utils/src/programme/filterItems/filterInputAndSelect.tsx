import { Input, Select } from 'antd';
import _ from 'lodash';
import { action, set, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase } from './common';
import styles from './filterItems.less';

export class FilterInputAndSelect extends FilterBase {
  constructor(options: Partial<FilterInputAndSelect>) {
    super(options);
    set(this, {
      toParams: this.toParams,
      ...options,
      showCollapse: false,
    });
    this.formatValue(`${_.toString(this.selectValue)},${_.toString(this.value)}`);
    this.snapshot = {
      value: this.value,
      selectValue: this.selectValue,
    };
  }

  /**
   * 类型标志
   */
  @observable public type: 'inputAndSelect' = ENUM_FILTER_ITEM_TYPE.inputAndSelect;

  public toProgramme(): string {
    return this.selectValue ? `${this.selectValue},${this.value}` : '';
  }

  public toParams(this: FilterInputAndSelect): {[key: string]: string; } {
    if (this.selectValue && this.value != null) {
      return { [this.selectValue]: this.value };
    } else {
      return {};
    }
  }

  private snapshot: { value: string | undefined; selectValue: string; } = {
    value: '',
    selectValue: '',
  };

  @action public reset = (): void => {
    this.value = this.snapshot.value;
    this.selectValue = this.snapshot.selectValue;
  };

  @action
  public formatValue(this: FilterInputAndSelect, value?: string): void {
    const keyAndValue = _.toString(value)
      .split(',');
    this.value = _.toString(keyAndValue[1]);
    this.selectValue = keyAndValue[0] ? keyAndValue[0] : undefined;
  }

  /**
   * 输入框的值
   */
  @observable public value = '';

  /**
   * @internal
   */
  @observable.ref public inputRef = React.createRef<Input>();

  /**
   * @internal
   */
  @action public handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    this.value = event.target.value;
    if (typeof this.handleInputChangeCallback === 'function') {
      this.handleInputChangeCallback(this.value);
    }
  };

  /**
   * 输入框改变值回掉
   */
  public handleInputChangeCallback: (value?: string) => void;

  /**
   * 下拉框的值
   */
  @observable public selectValue: string | undefined = '';

  /**
   * @internal
   */
  @action public handleSelectChange = (selectValue: string | undefined) => {
    this.selectValue = selectValue;
    this.inputRef.current.focus();
    if (typeof this.handleSelectChangeCallback === 'function') {
      this.handleSelectChangeCallback(this.selectValue);
    }
  };

  /**
   * 下拉框改变值回掉
   */
  public handleSelectChangeCallback: (value?: string | undefined) => void;

  /**
   * 输入框提示文字
   */
  @observable public placeholder = '请输入';

  /**
   * 是否可以清除
   */
  @observable public allowClear = false;

  /**
   * 下拉框-输入框禁止状态
   */
  @observable public disabled = false;
}

/**
 * @internal
 */
@observer
export class FilterInputAndSelectComponent extends React.Component<{ store: FilterInputAndSelect; }> {
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
      selectValue,
      inputRef,
      disabled,
    } = this.props.store;
    return (
      <div
        className={`filterInputAndSelect ${className}`}
        style={toJS(style)}
      >
        <Select
          bordered={false}
          disabled={disabled}
          onChange={handleSelectChange}
          options={data}
          placeholder="请选择"
          value={selectValue}
        />
        <Input
          allowClear
          bordered={false}
          className={`${styles.input}`}
          disabled={disabled}
          onChange={handleInputChange}
          onPressEnter={this.handlePressEnter}
          placeholder={placeholder}
          ref={inputRef}
          value={value}
        />
      </div>
    );
  }
}
