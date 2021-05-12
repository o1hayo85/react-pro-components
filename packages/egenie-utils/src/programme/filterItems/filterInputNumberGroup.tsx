import { InputNumber, Select, Typography } from 'antd';
import { action, extendObservable, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase } from './common';

function formatNumber(num: unknown): number {
  const newNum = Number(num);
  return isFinite(newNum) ? newNum : 0;
}

function formatNumberString(value: [number, number]) {
  if (value[0] == null && value[1] == null) {
    return '';
  }

  if (value[0] != null && value[1] != null) {
    return `${formatNumber(value[0])},${formatNumber(value[1])}`;
  } else if (value[0] == null) {
    return `,${formatNumber(value[1])}`;
  } else {
    return `${formatNumber(value[0])},`;
  }
}

export class FilterInputNumberGroup extends FilterBase {
  constructor(options: Partial<FilterInputNumberGroup>) {
    super(options);
    extendObservable(this, {
      toParams: this.toParams,
      ...options,
      showCollapse: false,
    });
    this.formatValue(this.value);
    this.snapshot.value = toJS(this.value);
    this.snapshot.selectedValue = this.selectValue;
  }

  /**
   * 类型标志
   */
  @observable public type: 'inputNumberGroup' = ENUM_FILTER_ITEM_TYPE.inputNumberGroup;

  public toProgramme(): string {
    return this.data.length > 1 ? `${this.selectValue || ''},${formatNumberString(this.value)}` : formatNumberString(this.value);
  }

  public toParams(this: FilterInputNumberGroup): {[key: string]: string; } {
    const num = formatNumberString(this.value);
    if (this.data.length > 1) {
      if (this.selectValue && num) {
        return { [this.selectValue]: num };
      } else {
        return {};
      }
    } else {
      if (num) {
        return { [this.field]: num };
      } else {
        return {};
      }
    }
  }

  public formatValue(this: FilterInputNumberGroup, value?: string | [number, number]): void {
    if (Array.isArray(value)) {
      this.value = value;
    } else if (typeof value === 'string') {
      const array = String(value)
        .split(',');
      const result: [number, number] = [
        null,
        null,
      ];

      if (this.data.length > 1) {
        this.selectValue = array[0] || undefined;
        if (array[1]) {
          result[0] = formatNumber(array[1]);
        }

        if (array[2]) {
          result[1] = formatNumber(array[2]);
        }
      } else {
        if (array[0]) {
          result[0] = formatNumber(array[0]);
        }

        if (array[1]) {
          result[1] = formatNumber(array[1]);
        }
      }

      this.value = result;
    } else {
      this.value = [
        null,
        null,
      ];
      this.selectValue = undefined;
    }
  }

  private snapshot: { value: [number, number]; selectedValue?: string; } = {
    value: [
      null,
      null,
    ],
    selectedValue: undefined,
  };

  @action public reset = (): void => {
    this.value = this.snapshot.value;
    this.selectValue = this.snapshot.selectedValue;
  };

  /**
   * 下拉框的值。data的长度大于1才需要传。和filterDate类似
   */
  @observable public selectValue: string | undefined = undefined;

  /**
   * @internal
   */
  @action public handleSelectValue = (selectedValue: string | undefined) => {
    this.selectValue = selectedValue;
  };

  /**
   * 值[min, max]
   */
  @observable public value: [number, number] = [
    null,
    null,
  ];

  /**
   * @internal
   */
  @action public onMinChange = (min) => {
    this.value[0] = min;
  };

  /**
   * @internal
   */
  @action public onMaxChange = (max) => {
    this.value[1] = max;
  };

  /**
   * 输入框提示文字
   */
  @observable public placeholder: [string, string] = [
    '请输入',
    '请输入',
  ];

  /**
   * 是否禁止
   */
  @observable public disabled = false;

  /**
   * 每次改变步数，可以为小数
   */
  @observable public step = 1;
}

/**
 * @internal
 */
@observer
export class FilterInputNumberGroupComponent extends React.Component<{ store: FilterInputNumberGroup; }> {
  public handlePressEnter: React.KeyboardEventHandler = (event) => {
    if (typeof this.props.store.onPressEnter === 'function') {
      this.props.store.onPressEnter();
    }
  };

  render() {
    const {
      value,
      placeholder,
      onMinChange,
      onMaxChange,
      step,
      disabled,
      style,
      className,
      label,
      data,
      selectValue,
      handleSelectValue,
    } = this.props.store;
    return (
      <div
        className={`filterInputNumberGroup ${className}`}
        style={toJS(style)}
      >
        {
          (() => {
            return data.length > 1 ? (
              <Select
                bordered={false}
                onChange={handleSelectValue}
                options={data}
                placeholder="请选择"
                value={selectValue}
              />
            ) : (
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
            );
          })()
        }

        <div className="filterInputNumberGroupContent">
          <InputNumber
            bordered={false}
            disabled={disabled}
            onChange={onMinChange}
            onPressEnter={this.handlePressEnter}
            placeholder={placeholder[0]}
            step={step}
            value={value[0]}
          />
          <span/>
          <InputNumber
            bordered={false}
            disabled={disabled}
            onChange={onMaxChange}
            onPressEnter={this.handlePressEnter}
            placeholder={placeholder[1]}
            step={step}
            value={value[1]}
          />
        </div>
      </div>
    );
  }
}
