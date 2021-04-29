import _ from 'lodash';
import { action, intercept, observable } from 'mobx';
import React from 'react';
import { FilterCascader } from './filterCascader';
import { FilterCheckbox } from './filterCheckbox';
import { FilterDate } from './filterDate';
import { FilterInput } from './filterInput';
import { FilterInputAndSelect } from './filterInputAndSelect';
import { FilterInputNumberGroup } from './filterInputNumberGroup';
import { FilterInputOrSelect } from './filterInputOrSelect';
import { FilterRadio } from './filterRadio';
import { FilterSelect } from './filterSelect';

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
  checkbox = 'checkbox',
  inputOrSelect = 'inputOrSelect',
  cascader = 'cascader',
}

/**
 * 查询项data的统一格式
 */
export type ValueAndLabelData = Array<{ value: string; label: string; [key: string]: any; }>;

/**
 * 查询项基本类。抽取统一的字段和方法
 */
export abstract class FilterBase {
  constructor(options: FilterItemOptions = {}) {
    this.data = formatValueAndLabelData(options.data);
    intercept(this, 'data', (change) => {
      change.newValue = formatValueAndLabelData(change.newValue);
      return change;
    });
  }

  /**
   * 创建查询方案时对每个查询项值的处理
   * 外层一般不需要重写
   */
  abstract toProgramme(): string | null;

  /**
   * 对外暴露的params的处理
   * 外层一般不需要重写
   */
  abstract toParams(this: this): {[key: string]: string; };

  /**
   * 格式化查询项值
   * 外层一般不需要重写
   */
  abstract formatValue(this: this, value?: string): void;

  /**
   * 查询项重置
   * 外层一般不需要重写
   */
  abstract reset(): void;

  /**
   * 是否显示查询项
   */
  @observable public showItem = true;

  /**
   * 查询项是否可以收缩。现在不需要传，内置了
   */
  @observable public showCollapse = false;

  /**
   * 查询项是否收缩。必须showCollapse为true才生效
   */
  @observable public isCollapse = false;

  /**
   * 切换收缩状态
   */
  @action public toggleCollapse = () => {
    this.isCollapse = !this.isCollapse;
  };

  /**
   * 查询项标识。必须且不能重复否则报错
   */
  @observable public field = '';

  /**
   * 查询项名称。必须且不能重复否则报错
   */
  @observable public label = '';

  /**
   * 按回车的回掉函数
   */
  // eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/no-empty-function
  @action public onPressEnter: Function = () => {
  };

  /**
   * 包裹div的样式
   */
  @observable.ref public style: React.CSSProperties = {};

  /**
   * 包裹div的className
   */
  @observable public className = '';

  /**
   * 查询项数据。为value、label形式。value必须为string，不然可能会出问题
   */
  @observable public data: ValueAndLabelData = [];

  /**
   * 设置查询项数据
   * @param data 数据
   */
  @action public handleData = (data: ValueAndLabelData): void => {
    this.data = data;
  };

  /**
   * 是否是动态添加字段（方案保存、方案设置等需要过滤）
   */
  @observable public isDynamic = false;
}

/**
 * @internal
 */
export function formatValueAndLabelData(data: ValueAndLabelData): ValueAndLabelData {
  if (Array.isArray(data)) {
    return data.map((item) => ({
      ...item,
      value: _.toString(item.value),
      label: _.toString(item.label),
    }));
  } else {
    return [];
  }
}

/**
 * 查询项种类
 */
export type FilterItem = FilterInput | FilterInputNumberGroup | FilterSelect | FilterRadio | FilterInputAndSelect | FilterDate | FilterCheckbox | FilterInputOrSelect | FilterCascader;

/**
 * 查询项参数
 */
export type FilterItemOptions = Partial<FilterItem>;
