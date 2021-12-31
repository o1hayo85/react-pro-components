import { Typography } from 'antd';
import _ from 'lodash';
import React from 'react';
import { FilterCascader } from './filterCascader';
import { FilterCheckbox } from './filterCheckbox';
import { FilterDate } from './filterDate';
import { FilterDateStartOrEnd } from './filterDateStartOrEnd';
import { FilterInput } from './filterInput';
import { FilterInputAndSelect } from './filterInputAndSelect';
import { FilterInputNumberGroup } from './filterInputNumberGroup';
import { FilterInputOrSelect } from './filterInputOrSelect';
import { FilterRadio } from './filterRadio';
import { FilterSelect } from './filterSelect';
import { FilterTreeSelect } from './filterTreeSelect';
import type { FilterItem, FilterItemOptions, ValueAndLabelData } from './types';
import { ENUM_FILTER_ITEM_TYPE } from './types';

export function formatValueAndLabelData(data: ValueAndLabelData): ValueAndLabelData {
  if (Array.isArray(data)) {
    return data.map((item) => ({
      ...item,
      children: Array.isArray(item.children) && item.children.length ? formatValueAndLabelData(item.children) : undefined,
      value: _.toString(item.value),
      label: _.toString(item.label),
    }));
  } else {
    return [];
  }
}

export function FilterItemLabel({
  labelWidth,
  label,
  required,
}: { labelWidth: number; label: string; required: boolean; }) {
  return (
    <div
      className="filterLabel mark-option"
      style={{
        width: labelWidth,
        maxWidth: labelWidth,
      }}
      title={label}
    >
      <Typography.Title
        ellipsis={{ rows: 1 }}
        level={3}
        title={label}
      >
        {
          required ? (
            <span style={{
              verticalAlign: 'middle',
              color: '#ff4d4f',
            }}
            >
              *
            </span>
          ) : null
        }
        {label}
      </Typography.Title>
    </div>
  );
}

export function trimWhiteSpace(value: string, isTrimWhiteSpace: boolean): string {
  if (isTrimWhiteSpace) {
    return _.flowRight([
      _.trimEnd,
      _.trimStart,
      _.toString,
    ])(value);
  } else {
    return _.toString(value);
  }
}

export const throttleTime = 300;

// @ts-ignore
export function filterInstanceFactory(item: FilterItemOptions): FilterItem {
  switch (item.type) {
    case ENUM_FILTER_ITEM_TYPE.input:
      return new FilterInput(item);
    case ENUM_FILTER_ITEM_TYPE.inputNumberGroup:
      return new FilterInputNumberGroup(item);
    case ENUM_FILTER_ITEM_TYPE.select:
      return new FilterSelect(item);
    case ENUM_FILTER_ITEM_TYPE.radio:
      return new FilterRadio(item);
    case ENUM_FILTER_ITEM_TYPE.inputAndSelect:
      return new FilterInputAndSelect(item);
    case ENUM_FILTER_ITEM_TYPE.date:
    case ENUM_FILTER_ITEM_TYPE.dateRange:
      return new FilterDate(item);
    case ENUM_FILTER_ITEM_TYPE.dateStart:
    case ENUM_FILTER_ITEM_TYPE.dateEnd:
      return new FilterDateStartOrEnd(item);
    case ENUM_FILTER_ITEM_TYPE.checkbox:
      return new FilterCheckbox(item);
    case ENUM_FILTER_ITEM_TYPE.inputOrSelect:
      return new FilterInputOrSelect(item);
    case ENUM_FILTER_ITEM_TYPE.cascader:
      return new FilterCascader(item);
    case ENUM_FILTER_ITEM_TYPE.treeSelect:
      return new FilterTreeSelect(item);
  }
}

