import { Button, Divider, Select } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import type { FilterSelect } from './filterSelect';
import { FilterItemLabel } from './utils';

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
      required,
      showArrow,
    } = this.props.store;
    return (
      <div
        className={`filterSelect ${className}`}
        style={toJS(style)}
      >
        <FilterItemLabel
          label={label}
          labelWidth={labelWidth}
          required={required}
        />
        <Select
          allowClear={allowClear}
          bordered={false}
          disabled={disabled}
          dropdownMatchSelectWidth={false}
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
          getPopupContainer={(nodeItem) => nodeItem.parentElement}
          maxTagCount="responsive"
          mode={mode}
          onChange={onChange}
          onSearch={onSearch}
          optionFilterProp="label"
          options={options}
          placeholder={placeholder}
          searchValue={searchValue}
          showArrow={showArrow}
          showSearch={showSearch}
          style={{ width: `calc(100% - ${labelWidth}px)` }}
          value={toJS(value)}
        />
      </div>
    );
  }
}
