import { Checkbox } from 'antd';
import { action, intercept, observable, extendObservable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { FilterBase } from './filterBase';
import styles from './filterItems.less';
import { ENUM_FILTER_ITEM_TYPE } from './types';

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
    const {
      data,
      ...rest
    } = options;

    extendObservable(this, {
      ...rest,
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

  public translateParams(this: FilterCheckbox): string[] {
    if (Array.isArray(this.value) && this.value.length) {
      return [
        this.label,
        this.value.map((item) => this.data.find((val) => val.value === item)?.label || '')
          .join(','),
      ];
    } else {
      return [];
    }
  }

  @action
  public formatValue(this: FilterCheckbox, value?: string | string[]): void {
    this.value = formatValue(value);
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
   * 选中值
   */
  @observable public value: string [] = [];

  /**
   * @internal
   */
  @action public onChange = (value: string[]) => {
    this.value = value || [];
    this.handleCallback();
  };

  /**
   * 改变值回掉
   */
  public onChangeCallback: (value?: string[]) => void;

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

          // @ts-ignore
          onChange={onChange}
          options={data}
          value={value}
        />
      </div>
    );
  }
}
