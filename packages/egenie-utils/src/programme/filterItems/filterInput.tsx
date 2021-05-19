import { Input, Typography } from 'antd';
import _ from 'lodash';
import { action, set, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase } from './common';

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
    set(this, {
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
  @observable public type: 'input' = ENUM_FILTER_ITEM_TYPE.input;

  public toProgramme(): string {
    return formatValue(this.value, this.isTrimWhiteSpace);
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

  @action public reset = (): void => {
    this.value = this.snapshot;
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

    if (typeof this.onChangeCallback === 'function') {
      this.onChangeCallback(formatValue(this.value, this.isTrimWhiteSpace));
    }
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
    } = this.props.store;
    return (
      <div
        className={`filterInput ${className}`}
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
