import { Input } from 'antd';
import _ from 'lodash';
import { action, extendObservable, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase, FilterItemLabel } from './common';

function formatValue(value: string, isTrimWhiteSpace: boolean) {
  if (isTrimWhiteSpace) {
    return _.flowRight([
      _.trimEnd,
      _.trimStart,
      _.toString,
    ])(value);
  } else {
    return _.toString(value);
  }
}

export class FilterInput extends FilterBase {
  constructor(options: Partial<FilterInput>) {
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
  }

  /**
   * 类型标志
   */
  @observable public type: 'input' = ENUM_FILTER_ITEM_TYPE.input;

  public toProgramme(): string | null {
    if (formatValue(this.value, this.isTrimWhiteSpace)) {
      return formatValue(this.value, this.isTrimWhiteSpace);
    } else {
      return null;
    }
  }

  public toParams(this: FilterInput): {[key: string]: string; } {
    if (this.toProgramme()) {
      return { [this.field]: this.toProgramme() };
    } else {
      return {};
    }
  }

  @action
  public formatValue(this: FilterInput, value?: string): void {
    this.value = _.toString(value);
  }

  private snapshot = '';

  @action private handleCallback = () => {
    if (typeof this.onChangeCallback === 'function') {
      this.onChangeCallback(formatValue(this.value, this.isTrimWhiteSpace));
    }
  };

  @action public reset = (): void => {
    this.value = this.snapshot;
    this.handleCallback();
  };

  /**
   * 输入的值
   */
  @observable public value = '';

  /**
   * @internal
   */
  @action public onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    this.value = event.target.value;
    this.handleCallback();
  };

  /**
   * 改变值回掉
   */
  public onChangeCallback: (value?: string) => void;

  /**
   * 是否去掉左右空格
   */
  @observable public isTrimWhiteSpace = true;

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
}

/**
 * @internal
 */
@observer
export class FilterInputComponent extends React.Component<{ store: FilterInput; }> {
  public handlePressEnter: React.KeyboardEventHandler = (event) => {
    if (typeof this.props.store.onPressEnter === 'function') {
      this.props.store.onPressEnter();
    }
  };

  render() {
    const {
      value,
      onChange,
      placeholder,
      allowClear,
      disabled,
      style,
      className,
      label,
      labelWidth,
      required,
    } = this.props.store;
    return (
      <div
        className={`filterInput ${className}`}
        style={toJS(style)}
      >
        <FilterItemLabel
          label={label}
          labelWidth={labelWidth}
          required={required}
        />
        <Input
          allowClear={allowClear}
          bordered={false}
          disabled={disabled}
          onChange={onChange}
          onPressEnter={this.handlePressEnter}
          placeholder={placeholder}
          value={value}
        />
      </div>
    );
  }
}
