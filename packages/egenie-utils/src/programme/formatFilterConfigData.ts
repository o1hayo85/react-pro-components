import { BaseData } from '../request';
import { ValueAndLabelData } from './filterItems';
import { ProgrammeListItem } from './programme';

export type FilterConfigData = BaseData<{ old_set: ProgrammeListItem[]; item_list: {[key: string]: {[key: string]: string; }; }; dict_list: {[key: string]: Array<{[key: string]: string; }>; }; }>;
type FilterConfigTransformData = Array<{ field: string; data: ValueAndLabelData; }>;

export function formatFilterConfigData(info: FilterConfigData, fieldMap: {[key: string]: string; }): FilterConfigTransformData {
  const list: FilterConfigTransformData = [];
  Object.entries(info.data.item_list || {})
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
  Object.entries(info.data.dict_list || {})
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
