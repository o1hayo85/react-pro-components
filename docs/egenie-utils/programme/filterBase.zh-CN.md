---
title: FilterBase
order: 2
---

## ENUM_FILTER_ITEM_TYPE

```ts
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
```

## `ValueAndLabelData`

- 查询项 data 的统一格式(`value必须是string`)
- 类型: `Array<{ value: string; label: string; [key: string]: any; }>`

## `FilterItem`

- 查询项种类
- 类型: [FilterInput](./filter-input) | [FilterInputNumberGroup](./filter-input-number-group) | [FilterSelect](./filter-select) | [FilterRadio](./filter-radio) | [FilterInputAndSelect](./filter-input-and-select) | [FilterDate](./filter-date) | [FilterCheckbox](./filter-checkbox) | [FilterInputOrSelect](./filter-input-or-select) | [FilterCascader](./filter-cascader) | [FilterDateStartOrEnd](./filter-date-start-or-end) | [FilterTreeSelect](./filter-tree-select);

## `FilterItemOptions`

- 查询项参数
- 类型: Partial<[FilterItem](#filteritem)>

## `FilterBase`

### showItem

- 描述: 是否显示查询项
- 类型: boolean
- 默认值: true

### labelWidth

- 描述: label 显示宽度
- 类型: number
- 默认值: 92

### showCollapse

- 描述: 查询项是否可以收缩。`现在不需要传，内置了`
- 类型: boolean
- 默认值: false

### isCollapse

- 描述: 查询项是否收缩。必须 showCollapse 为 true 才生效
- 类型: boolean
- 默认值: false

### `type`

- 描述: `查询项类型`
- 类型: [ENUM_FILTER_ITEM_TYPE](#enum_filter_item_type)
- 默认值: 无

### `field`

- 描述: `查询项标识。必须且不能重复否则报错`
- 类型: string
- 默认值: 空字符

### `label`

- 描述: `查询项名称。必须且不能重复否则报错`
- 类型: string
- 默认值: 空字符

### style

- 描述: 包裹 div 的样式
- 类型: React.CSSProperties
- 默认值: {}

### className

- 描述: 包裹 div 的 className
- 类型: string
- 默认值: 空字符

### `data`

- 描述: `查询项数据。当type为radio时，item的showInput为true时，此项为可选可输入`
- 类型: [ValueAndLabelData](#valueandlabeldata)
- 默认值: []

### `required`

- 描述: `是否为必选字段`
- 类型: boolean
- 默认值: false
