import { Input, Select } from 'antd';
import { action, extendObservable, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { FilterBase } from './filterBase';
import { ENUM_FILTER_ITEM_TYPE } from './types';
import { trimWhiteSpace } from './utils';

export class FilterInputOrSelect extends FilterBase {
  constructor(options: Partial<FilterInputOrSelect>) {
    super(options);
    const {
      data,
      ...rest
    } = options;
    extendObservable(this, {
      ...rest,
      showCollapse: false,
    });
    this.formatValue(this.value || this.selectValue);
    this.snapshot = {
      value: this.value,
      selectValue: this.selectValue,
    };
  }

  /**
   * 类型标志
   */
  @observable public type: 'inputOrSelect' = ENUM_FILTER_ITEM_TYPE.inputOrSelect;

  public toProgramme(): string | null {
    if (trimWhiteSpace(this.value, this.isTrimWhiteSpace)) {
      return trimWhiteSpace(this.value, this.isTrimWhiteSpace);
    } else {
      if (this.selectValue != undefined) {
        return this.selectValue;
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

  public translateParams(this: FilterInputOrSelect): string[] {
    if (trimWhiteSpace(this.value, this.isTrimWhiteSpace)) {
      return [
        this.label,
        trimWhiteSpace(this.value, this.isTrimWhiteSpace),
      ];
    } else {
      if (this.selectValue != undefined) {
        return [
          this.label,
          this.data.find((item) => item.value === this.selectValue)?.label || '',
        ];
      } else {
        return [];
      }
    }
  }

  private snapshot: { value: string; selectValue: string; } = {
    value: '',
    selectValue: undefined,
  };

  @action public reset = (): void => {
    this.value = this.snapshot.value;
    this.selectValue = this.snapshot.selectValue;
    if (typeof this.handleChangeCallback === 'function') {
      this.handleChangeCallback(trimWhiteSpace(this.value, this.isTrimWhiteSpace) || this.selectValue);
    }
  };

  @action
  public formatValue(this: FilterInputOrSelect, value?: string): void {
    const item = this.data.find((item) => item.value === value);
    if (item) {
      this.selectValue = item.value;
      this.value = '';
    } else {
      this.value = trimWhiteSpace(value, this.isTrimWhiteSpace);
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
    if (typeof this.handleChangeCallback === 'function') {
      this.handleChangeCallback(trimWhiteSpace(this.value, this.isTrimWhiteSpace));
    }
  };

  @observable public selectValue: string | undefined = undefined;

  /**
   * @internal
   */
  @action public handleSelectChange = (selectValue: string | undefined) => {
    this.selectValue = selectValue;
    if (typeof this.handleChangeCallback === 'function') {
      this.handleChangeCallback(this.selectValue);
    }
  };

  /**
   * 值改变回掉
   */
  public handleChangeCallback: (value?: string | undefined) => void;

  /**
   * 输入框提示文字
   */
  @observable public placeholder = '请输入';

  /**
   * 是否可清除
   */
  @observable public allowClear = true;

  /**
   * 是否禁止
   */
  @observable public disabled = false;

  /**
   * 是否去掉输入框左右空格
   */
  @observable public isTrimWhiteSpace = true;
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
      selectValue,
      allowClear,
      disabled,
      labelWidth,
    } = this.props.store;
    return (
      <div
        className={`filterInputOrSelect ${className}`}
        style={toJS(style)}
      >
        <section>
          <Input
            allowClear={allowClear}
            bordered={false}
            disabled={disabled}
            onChange={handleInputChange}
            onPressEnter={this.handlePressEnter}
            placeholder={placeholder}
            value={value}
          />
          <Select
            allowClear
            bordered={false}
            disabled={disabled}
            dropdownMatchSelectWidth={false}
            getPopupContainer={(nodeItem) => nodeItem.parentElement}
            onChange={handleSelectChange}
            options={data}
            placeholder="请选择"
            style={{
              width: labelWidth,
              maxWidth: labelWidth,
            }}
            value={selectValue}
          />
        </section>
      </div>
    );
  }
}