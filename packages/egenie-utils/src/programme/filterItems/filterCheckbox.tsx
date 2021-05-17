import { Checkbox } from 'antd';
import { action, extendObservable, intercept, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase } from './common';
import styles from './filterItems.less';

function formatValue(value?: string[] | string): string[] {
  if (Array.isArray(value)) {
    return value;
  } else if (typeof value === 'string') {
    return value.split(',')
      .filter(Boolean);
  } else {
    return [];
  }
}

export class FilterCheckbox extends FilterBase {
  constructor(options: Partial<FilterCheckbox>) {
    super(options);
    extendObservable(this, {
      toParams: this.toParams,
      ...options,
      showCollapse: true,
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
  @observable public type: 'checkbox' = ENUM_FILTER_ITEM_TYPE.checkbox;

  public toProgramme(): string | null {
    if (Array.isArray(this.value) && this.value.length) {
      return this.value.join(',');
    } else {
      return null;
    }
  }

  public toParams(this: FilterCheckbox): {[key: string]: string; } {
    if (this.toProgramme()) {
      return { [this.field]: this.toProgramme() };
    } else {
      return {};
    }
  }

  @action
  public formatValue(this: FilterCheckbox, value?: string | string[]): void {
    this.value = formatValue(value);
  }

  private snapshot: string[] = [];

  @action public reset = (): void => {
    this.value = this.snapshot;
  };

  /**
   * 选中值
   */
  @observable public value: string [] = [];

  /**
   * @internal
   */
  @action public onChange = (value: string[]) => {
    this.value = value || [];
    if (typeof this.onChangeCallback === 'function') {
      this.onChangeCallback(this.value);
    }
  };

  /**
   * 改变值回掉
   */
  @action public onChangeCallback: (value?: string[]) => void;

  /**
   * 是否禁止
   */
  @observable public disabled = false;
}

/**
 * @internal
 */
@observer
export class FilterCheckboxComponent extends React.Component<{ store: FilterCheckbox; }> {
  render() {
    const {
      value,
      onChange,
      disabled,
      style,
      className = '',
      data,
    } = this.props.store;
    return (
      <div
        className={`${styles.filterCheckbox} ${className}`}
        style={toJS(style)}
      >
        <Checkbox.Group
          disabled={disabled}
          onChange={onChange}
          options={data}
          value={value}
        />
      </div>
    );
  }
}
