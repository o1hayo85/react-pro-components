import { Input, Select } from 'antd';
import _ from 'lodash';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import type { FilterInputAndSelect } from './filterInputAndSelect';
import { MultipleSearch } from './multipleSearch';
import { throttleTime } from './utils';

@observer
export class FilterInputAndSelectComponent extends React.Component<{ store: FilterInputAndSelect; }> {
  public handlePressEnter: React.KeyboardEventHandler = _.throttle((event) => {
    if (typeof this.props.store.onPressEnter === 'function') {
      this.props.store.onPressEnter();
    }
  }, throttleTime);

  render() {
    const {
      inputValue,
      handleInputChange,
      placeholder,
      style,
      className,
      data,
      handleSelectChange,
      selectValue,
      inputRef,
      disabled,
      labelWidth,
      isMultipleSearch,
      splitSymbol,
    } = this.props.store;
    return (
      <div
        className={`filterInputAndSelect ${className}`}
        style={toJS(style)}
      >
        <Select
          bordered={false}
          disabled={disabled}
          dropdownMatchSelectWidth={false}
          getPopupContainer={(nodeItem) => nodeItem.parentElement}
          onChange={handleSelectChange}
          options={data}
          placeholder="请选择"
          style={{
            width: labelWidth,
            maxWidth: labelWidth,
          }}
          value={selectValue}
        />
        <Input
          allowClear
          bordered={false}
          disabled={disabled}
          onChange={(event) => handleInputChange(event.target.value)}
          onPressEnter={this.handlePressEnter}
          placeholder={placeholder}
          ref={inputRef}
          suffix={isMultipleSearch ? (
            <MultipleSearch
              callback={handleInputChange}
              splitSymbol={splitSymbol}
              value={inputValue}
            />
          ) : null}
          value={inputValue}
        />
      </div>
    );
  }
}
