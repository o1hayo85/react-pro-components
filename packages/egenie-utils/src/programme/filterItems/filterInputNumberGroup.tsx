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
    const {
      data,
      ...rest
    } = options;

    extendObservable(this, {
      ...rest,
      showCollapse: false,
    });

    if (this.data.length > 1) {
      this.formatValue(`${this.selectValue},${formatNumberString(this.value)}`);
    } else {
      this.formatValue(formatNumberString(this.value));
    }

    this.snapshot.value = toJS(this.value);
    this.snapshot.selectedValue = this.selectValue;
  }

  /**
   * 类型标志
   */
  @observable public type: 'inputNumberGroup' = ENUM_FILTER_ITEM_TYPE.inputNumberGroup;

  public toProgramme(): string {
    if (this.data.length > 1) {
      if (this.selectValue) {
        return `${this.selectValue},${formatNumberString(this.value)}`;
      } else {
        return null;
      }
    } else {
      return formatNumberString(this.value);
    }
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
    selectedValue: '',
  };

  @action public reset = (): void => {
    this.value = this.snapshot.value;
    this.selectValue = this.snapshot.selectedValue;

    if (typeof this.handleSelectChangeCallback === 'function') {
      this.handleSelectChangeCallback(this.selectValue);
    }

    if (typeof this.handleChangeCallback === 'function') {
      this.handleChangeCallback([
        this.value[0],
        this.value[1],
      ]);
    }
  };

  /**
   * 下拉框的值。data的长度大于1才需要传。和filterDate类似
   */
  @observable public selectValue = '';

  /**
   * @internal
   */
  @action public handleSelectValue = (selectedValue: string) => {
    this.selectValue = selectedValue;
    if (typeof this.handleSelectChangeCallback === 'function') {
      this.handleSelectChangeCallback(this.selectValue);
    }
  };

  /**
   * 下拉框改变值回掉
   */
  public handleSelectChangeCallback: (value?: string | undefined) => void;

  /**
   * number输入框改变值回掉
   */
  public handleChangeCallback: (value?: [number, number]) => void;

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
  @action public onMinChange = (min: number | null) => {
    this.value[0] = typeof min === 'number' ? min : null;
    if (typeof this.handleChangeCallback === 'function') {
      this.handleChangeCallback([
        this.value[0],
        this.value[1],
      ]);
    }
  };

  /**
   * @internal
   */
  @action public onMaxChange = (max: number | null) => {
    this.value[1] = typeof max === 'number' ? max : null;
    if (typeof this.handleChangeCallback === 'function') {
      this.handleChangeCallback([
        this.value[0],
        this.value[1],
      ]);
    }
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
      labelWidth,
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
                disabled={disabled}
                onChange={handleSelectValue}
                options={data}
                placeholder="请选择"
                style={{
                  width: labelWidth,
                  maxWidth: labelWidth,
                }}
                value={selectValue}
              />
            ) : (
              <div
                className="filterLabel"
                style={{
                  width: labelWidth,
                  maxWidth: labelWidth,
                }}
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

        <div
          className="filterInputNumberGroupContent"
          style={{ borderRadius: data.length > 1 ? '0 2px 2px 0' : 2 }}
        >
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
