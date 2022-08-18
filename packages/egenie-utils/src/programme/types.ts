import type { BaseData } from '../request';

export interface ProgrammeListItem {
  id: string;
  schemeName: string;
  schemeValue: string;
  displaySetting: string;
  sysSetting: boolean;
}

export interface FilterSetItem {
  oldSet?: ProgrammeListItem[];
  item_list?: {[key: string]: {[key: string]: string; }; };
  itemList?: {[key: string]: {[key: string]: string; }; };
  dict_list?: {[key: string]: Array<{[key: string]: string; }>; };
  dictList?: {[key: string]: Array<{[key: string]: string; }>; };
}

export type FilterConfigData = BaseData<FilterSetItem>;
