import { Button, Divider, Select, Typography } from 'antd';
import { action, computed, extendObservable, intercept, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase, ValueAndLabelData } from './common';

function formatValue(oldValue, mode) {
  if (mode) {
    if (Array.isArray(oldValue)) {
      return oldValue.map((item) => String(item));
    } else {
      return [];
    }
  } else {
    if (oldValue == null) {
      return undefined;
    } else {
      return String(oldValue);
    }
  }
}

export class FilterSelect extends FilterBase {
  constructor(options: Partial<FilterSelect>) {
    super(options);
    const {
      data,
      ...rest
    } = options;
    extendObservable(this, {
      ...rest,
      showCollapse: false,
    });
    if (!this.placeholder) {
      this.placeholder = this.mode ? '请选择(可多选)' : '请选择';
    }
    this.formatValue(this.value);
    this.snapshot = toJS(this.value);

    intercept(this, 'value', (change) => {
      change.newValue = formatValue(change.newValue, this.mode);
      return change;
    });
  }

  /**
   * 类型标志
   */
  @observable public type: 'select' = ENUM_FILTER_ITEM_TYPE.select;

  public toProgramme(): string | null {
    if (this.mode) {
      if (Array.isArray(this.value) && this.value.length) {
        return this.value.join(',');
      } else {
        return null;
      }
    } else {
      if (this.value == null) {
        return null;
      } else {
        return String(this.value);
      }
    }
  }

  public toParams(this: FilterSelect): {[key: string]: string; } {
    if (this.toProgramme() == null) {
      return {};
    } else {
      return { [this.field]: this.toProgramme() };
    }
  }

  @action
  public formatValue(this: FilterSelect, value?: string | undefined | string[]): void {
    if (this.mode) {
      if (Array.isArray(value)) {
        this.value = value;
      } else if (value == null) {
        this.value = [];
      } else {
        this.value = String(value)
          .split(',')
          .filter(Boolean);
      }
    } else {
      if (value == null) {
        this.value = undefined;
      } else {
        this.value = String(value);
      }
    }
  }

  private snapshot: string | undefined | string[] = undefined;

  @action public reset = (): void => {
    this.value = this.snapshot;
  };

  /**
   * 选中值
   */
  @observable.ref public value: string | undefined | string[] = undefined;

  /**
   * @internal
   */
  @action public onChange = (value: string | string[]) => {
    this.value = value;
    if (typeof this.onChangeCallback === 'function') {
      this.onChangeCallback(toJS(this.value));
    }
  };

  /**
   * 值改变回掉
   */
  public onChangeCallback: (value?: string | string[] | undefined) => void;

  /**
   * @internal
   */
  @action public onSearch = (searchValue: string) => {
    this.searchValue = typeof searchValue === 'string' ? searchValue : '';
  };

  /**
   * 是否禁止
   */
  @observable public disabled = false;

  /**
   * 是否可清除
   */
  @observable public allowClear = true;

  /**
   * 输入框提示文字
   */
  @observable public placeholder = '';

  /**
   * 是否可搜索
   */
  @observable public showSearch = true;

  /**
   * 是否可以选中全部。多选才能生效
   */
  @observable public showChooseAll = false;

  /**
   * @internal
   */
  @observable public searchValue = '';

  /**
   * 最多显示数量
   */
  @observable public maxItemsLength = 1000;

  /**
   * 模式。默认单选、multiple为多选
   */
  @observable public mode: 'multiple' | undefined = undefined;

  /**
   * @internal
   */
  @computed
  public get options(): ValueAndLabelData {
    return this.data.filter((item) => item.label.toLowerCase()
      .includes(this.searchValue.toLowerCase()))
      .slice(0, this.maxItemsLength);
  }
}

/**
 * @internal
 */
@observer
export class FilterSelectComponent extends React.Component<{ store: FilterSelect; }> {
  public handleChooseAll = () => {
    this.props.store.onChange(this.props.store.options.map((item) => item.value));
  };

  render() {
    const {
      value,
      onChange,
      disabled,
      style,
      className,
      placeholder,
      allowClear,
      showSearch,
      options,
      searchValue,
      onSearch,
      mode,
      showChooseAll,
      label,
      labelWidth,
    } = this.props.store;
    return (
      <div
        className={`filterSelect ${className}`}
        style={toJS(style)}
      >
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
        <Select
          allowClear={allowClear}
          bordered={false}
          disabled={disabled}
          dropdownRender={mode && showChooseAll ? (menu) => {
            return (
              <>
                {menu}
                <Divider style={{ margin: '4px 0' }}/>
                <Button
                  block
                  onClick={this.handleChooseAll}
                  size="small"
                  type="primary"
                >
                  全选
                </Button>
              </>
            );
          } : null}
          maxTagCount="responsive"
          mode={mode}
          onChange={onChange}
          onSearch={onSearch}
          optionFilterProp="label"
          options={options}
          placeholder={placeholder}
          searchValue={searchValue}
          showSearch={showSearch}
          style={{ display: 'block' }}
          value={toJS(value)}
        />
      </div>
    );
  }
}
