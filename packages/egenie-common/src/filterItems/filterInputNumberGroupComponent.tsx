import { InputNumber, Select } from 'antd';
import _ from 'lodash';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import type { FilterInputNumberGroup } from './filterInputNumberGroup';
import { FilterItemLabel, throttleTime } from './utils';

@observer
export class FilterInputNumberGroupComponent extends React.Component<{ store: FilterInputNumberGroup; }> {
  public handlePressEnter: React.KeyboardEventHandler = _.throttle((event) => {
    if (typeof this.props.store.onPressEnter === 'function') {
      this.props.store.onPressEnter();
    }
  }, throttleTime);

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
      required,
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
                dropdownMatchSelectWidth={false}
                getPopupContainer={(nodeItem) => nodeItem.parentElement}
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
              <FilterItemLabel
                label={label}
                labelWidth={labelWidth}
                required={required}
              />
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
