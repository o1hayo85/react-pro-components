import { Input, Radio } from 'antd';
import _ from 'lodash';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import styles from '../filterItems.less';
import { MultipleSearch } from '../multipleSearch';
import { throttleTime } from '../utils';
import type { FilterPatternSearch } from './filterPatternSearch';

@observer
export class FilterPatternSearchComponent extends React.Component<{ store: FilterPatternSearch; }> {
  public handlePressEnter: React.KeyboardEventHandler = _.throttle((event) => {
    if (typeof this.props.store.onPressEnter === 'function') {
      this.props.store.onPressEnter();
    }
  }, throttleTime);

  render() {
    const {
      inputValue,
      handleInputChange,
      inputPlaceholder,
      style,
      className,
      data,
      handleSelectValue,
      inputRef,
      inputDisabled,
      selectValue,
      isMultipleSearch,
      splitSymbol,
    } = this.props.store;
    return (
      <div
        className={`${styles.filterPatternSearch} ${className}`}
        style={toJS(style)}
      >
        <Radio.Group value={selectValue}>
          {
            data.map((item) => (
              <Radio
                key={item.value}
                onClick={() => handleSelectValue(item.value)}
                value={item.value}
              >
                {item.label}
              </Radio>
            ))
          }
        </Radio.Group>
        <Input
          disabled={inputDisabled}
          onChange={(event) => handleInputChange(event.target.value)}
          onPressEnter={this.handlePressEnter}
          placeholder={inputPlaceholder}
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
