import { Checkbox } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import type { FilterCheckbox } from './filterCheckbox';
import styles from './filterItems.less';

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
