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
import { ENUM_FILTER_ITEM_TYPE } from './types';
import type { FilterItem, FilterItemOptions } from './types';

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
