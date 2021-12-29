import { Input } from 'antd';
import _ from 'lodash';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import type { FilterInput } from './filterInput';
import { FilterItemLabel, throttleTime } from './utils';

@observer
export class FilterInputComponent extends React.Component<{ store: FilterInput; }> {
  public handlePressEnter: React.KeyboardEventHandler = _.throttle((event) => {
    if (typeof this.props.store.onPressEnter === 'function') {
      this.props.store.onPressEnter();
    }
  }, throttleTime);

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
