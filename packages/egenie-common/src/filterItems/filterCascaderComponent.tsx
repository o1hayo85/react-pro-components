import { Cascader } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import type { FilterCascader } from './filterCascader';
import { FilterItemLabel } from './utils';

@observer
export class FilterCascaderComponent extends React.Component<{ store: FilterCascader; }> {
  render() {
    const {
      value,
      data,
      onChange,
      placeholder,
      allowClear,
      disabled,
      style,
      className,
      label,
      showSearch,
      loadData,
      fieldNames,
      labelWidth,
      required,
    } = this.props.store;

    return (
      <div
        className={`filterCascader ${className}`}
        style={toJS(style)}
      >
        <FilterItemLabel
          label={label}
          labelWidth={labelWidth}
          required={required}
        />
        <Cascader
          allowClear={allowClear}
          bordered={false}
          disabled={disabled}
          fieldNames={fieldNames}
          loadData={loadData}

          // @ts-ignore
          onChange={onChange}
          options={toJS(data)}
          placeholder={placeholder}
          showSearch={showSearch}
          value={value}
        />
      </div>
    );
  }
}
