import type { FilterCascader } from './filterCascader';
import type { FilterCheckbox } from './filterCheckbox';
import type { FilterDate } from './filterDate';
import type { FilterDateStartOrEnd } from './filterDateStartOrEnd';
import type { FilterInput } from './filterInput';
import type { FilterInputAndSelect } from './filterInputAndSelect';
import type { FilterInputNumberGroup } from './filterInputNumberGroup';
import type { FilterInputOrSelect } from './filterInputOrSelect';
import type { FilterRadio } from './filterRadio';
import type { FilterSelect } from './filterSelect';
import type { FilterTreeSelect } from './filterTreeSelect';

/**
 * 查询项类型
 */
export enum ENUM_FILTER_ITEM_TYPE {
  input = 'input',
  inputAndSelect = 'inputAndSelect',
  inputNumberGroup = 'inputNumberGroup',
  radio = 'radio',
  select = 'select',
  date = 'date',
  dateRange = 'dateRange',
  dateStart = 'dateStart',
  dateEnd = 'dateEnd',
  checkbox = 'checkbox',
  inputOrSelect = 'inputOrSelect',
  cascader = 'cascader',
  treeSelect = 'treeSelect',
}

/**
 * 查询项data的统一格式
 */
export type ValueAndLabelData = Array<{ value: string; label: string; [key: string]: any; }>;

/**
 * 查询项种类
 */
export type FilterItem =
  FilterInput
  | FilterInputNumberGroup
  | FilterSelect
  | FilterRadio
  | FilterInputAndSelect
  | FilterDate
  | FilterCheckbox
  | FilterInputOrSelect
  | FilterCascader
  | FilterDateStartOrEnd
  | FilterTreeSelect;

/**
 * 查询项参数
 */
export type FilterItemOptions = Partial<FilterItem>;

/**
 * 查询项保存类型
 */
export interface FilterItemSettingItem {
  field: string;
  label: string;
  showItem: boolean;
  showCollapse: boolean;
  isCollapse: boolean;
}