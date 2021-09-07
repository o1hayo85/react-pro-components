import { BaseData } from '../request';
import { ValueAndLabelData } from './filterItems';
import { ProgrammeListItem } from './programme';

interface FilterSetItem {
  oldSet?: ProgrammeListItem[];
  item_list?: {[key: string]: {[key: string]: string; }; };
  itemList?: {[key: string]: {[key: string]: string; }; };
  dict_list?: {[key: string]: Array<{[key: string]: string; }>; };
  dictList?: {[key: string]: Array<{[key: string]: string; }>; };
}

export type FilterConfigData = BaseData<FilterSetItem>;
type FilterConfigTransformData = Array<{ field: string; data: ValueAndLabelData; }>;

export function formatFilterConfigData(info: FilterConfigData, fieldMap: {[key: string]: string; }): FilterConfigTransformData {
  const list: FilterConfigTransformData = [];

  // 处理itemList，兼容新老版本
  Object.entries({
    ...info?.data?.item_list,
    ...info?.data?.itemList,
  })
    .forEach((item) => {
      // 可能为一对多，下同理
      const fieldList: string[] = [].concat(Object.prototype.hasOwnProperty.call(fieldMap, item[0]) ? fieldMap[item[0]] : item[0]);
      fieldList.forEach((field) => {
        list.push({
          field,
          data: Object.entries(item[1] || {})
            .map((valueAndLabel) => ({
              value: valueAndLabel[0],
              label: valueAndLabel[1],
            })),
        });
      });
    });

  // 处理dictList，兼容新老版本
  Object.entries({
    ...info?.data?.dict_list,
    ...info?.data?.dictList,
  })
    .forEach((item) => {
      const fieldList: string[] = [].concat(Object.prototype.hasOwnProperty.call(fieldMap, item[0]) ? fieldMap[item[0]] : item[0]);
      fieldList.forEach((field) => {
        list.push({
          field,
          data: Object.entries((item[1] || []).reduce((prev, current) => ({
            ...prev,
            ...current,
          }), {}))
            .map((valueAndLabel) => ({
              value: valueAndLabel[0],
              label: valueAndLabel[1],
            })),
        });
      });
    });
  return list;
}
