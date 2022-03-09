---
title: FilterCascader
order: 11
---

## `type`

- 描述: 类型标志
- 类型: 'cascader'
- 默认值: 'cascader'

## `isParamList`

- 前提: `egenie-common、egenie-utils版本大于等于0.12.0`
- 描述: 是否将参数转化为 Array,原来只支持转为 string
- 类型: boolean
- 默认值: false

## `data`

- 描述: `级联数据`
- 类型: [ValueAndLabelData](./filter-base#valueandlabeldata)
- 默认值: []

## `value`

- 描述: 选中值
- 类型: string[]
- 默认值: []

## `onChangeCallback`

- 描述: 改变值回掉
- 类型?: (value?: string[]) => void
- 默认值: 无

## `disabled`

- 描述: 是否禁止
- 类型: boolean
- 默认值: false

## [其他](./filter-base#filterbase)
