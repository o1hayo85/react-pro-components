---
title: FilterInputNumberGroup
order: 4
---

## `type`

- 描述: 类型标志
- 类型: 'inputNumberGroup'
- 默认值: 'inputNumberGroup'

## `data`

- 描述: `下拉框数据`
- 类型: [ValueAndLabelData](./filter-base#valueandlabeldata)
- 默认值: []

## `selectValue`

- 描述: 下拉框的值。`data的长度大于1才需要传`。和 filterInputAndSelect 类似
- 类型: string
- 默认值: 空字符

## `handleSelectChangeCallback`

- 描述: 下拉框改变值回掉
- 类型?: (value?: string | undefined) => void
- 默认值: 无

## `value`

- 描述: 值[min, max]
- 类型: [number, number]
- 默认值: [null, null]

## `handleChangeCallback`

- 描述: number 输入框改变值回掉
- 类型?: (value?: [number, number]) => void
- 默认值: 无

## `placeholder`

- 描述: 输入框提示文字
- 类型: [string, string]
- 默认值: ['请输入', '请输入']

## `disabled`

- 描述: 是否禁止
- 类型: boolean
- 默认值: false

## `step`

- 描述: 每次改变步数，可以为小数
- 类型: number
- 默认值: 1

## [其他](./filter-base#filterbase)
