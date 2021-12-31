import React from 'react';
import { FilterCascaderComponent } from './filterCascaderComponent';
import { FilterCheckboxComponent } from './filterCheckboxComponent';
import { FilterDateComponent } from './filterDateComponent';
import { FilterDateStartOrEndComponent } from './filterDateStartOrEndComponent';
import { FilterInputAndSelectComponent } from './filterInputAndSelectComponent';
import { FilterInputComponent } from './filterInputComponent';
import { FilterInputNumberGroupComponent } from './filterInputNumberGroupComponent';
import { FilterInputOrSelectComponent } from './filterInputOrSelectComponent';
import { FilterRadioComponent } from './filterRadioComponent';
import { FilterSelectComponent } from './filterSelectComponent';
import { FilterTreeSelectComponent } from './filterTreeSelectComponent';
import { ENUM_FILTER_ITEM_TYPE } from './types';
import type { FilterItem } from './types';

// 方便webstorm测试
export function filterComponentFactory(item: FilterItem): React.ReactNode {
  switch (item.type) {
    case ENUM_FILTER_ITEM_TYPE.input:
      return (
        <FilterInputComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.inputNumberGroup:
      return (
        <FilterInputNumberGroupComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.select:
      return (
        <FilterSelectComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.radio:
      return (
        <FilterRadioComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.inputAndSelect:
      return (
        <FilterInputAndSelectComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.date:
    case ENUM_FILTER_ITEM_TYPE.dateRange:
      return (
        <FilterDateComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.dateStart:
    case ENUM_FILTER_ITEM_TYPE.dateEnd:
      return (
        <FilterDateStartOrEndComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.checkbox:
      return (
        <FilterCheckboxComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.inputOrSelect:
      return (
        <FilterInputOrSelectComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.cascader:
      return (
        <FilterCascaderComponent
          key={item.field}
          store={item}
        />
      );
    case ENUM_FILTER_ITEM_TYPE.treeSelect:
      return (
        <FilterTreeSelectComponent
          key={item.field}
          store={item}
        />
      );
    default:
      return null;
  }
}
