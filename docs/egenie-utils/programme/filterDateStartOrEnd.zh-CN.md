---
title: FilterDateStartOrEnd
order: 12
---

## `type`

- 描述: 类型标志。dateStart 为选择开始时间。dateEnd 为选择结束时间
- 类型: 'dateStart' | 'dateEnd'
- 默认值: 'dateStart'

## `handleChangeCallback`

- 描述: 日期改变回掉
- 类型?: (value: moment.Moment | null) => void
- 默认值: 无

## `allowClear`

- 描述: `是否允许清除`
- 类型: boolean
- 默认值: true

## `format`

- 描述: 日期展示格式
- 类型: 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD'
- 默认值: 'YYYY-MM-DD HH:mm:ss'

## `formatParams`

- 描述: 日期转化成参数格式
- 类型: 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD'
- 默认值: 'YYYY-MM-DD HH:mm:ss'

## `value`

- 描述: 时间
- 类型: moment.Moment | null
- 默认值: null

## `disabled`

- 描述: 禁止状态
- 类型: boolean
- 默认值: false

## `placeholder`

- 描述: 输入框提示文字
- 类型: string
- 默认值: '开始时间' | '结束时间'

## [其他](./filter-base#filterbase)
