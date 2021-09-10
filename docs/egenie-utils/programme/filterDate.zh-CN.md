---
title: FilterDate
order: 8
---

## `type`

- 描述: 类型标志。date 为左右查询方案类型(带下拉选择)。dateRange 为 DatePicker.Range
- 类型: 'date' | 'dateRange'
- 默认值: 'date'

## `data`

- 描述: `日期类型的数据`
- 类型: [ValueAndLabelData](./filter-base#valueandlabeldata)
- 默认值: []

## `allowClear`

- 描述: `是否允许清除`
- 类型: boolean
- 默认值: true

## `allowEmpty`

- 描述: `允许起始项部分为空。type为dateRange生效`
- 类型: [boolean, boolean]
- 默认值: [true, true]

## `selectValue`

- 描述: 日期类型选中值
- 类型: string | undefined
- 默认值: undefined

## `handleChangeCallback`

- 描述: 日期改变回掉
- 类型?: (date?: [moment.Moment, moment.Moment]) => void
- 默认值: 无

## `format`

- 描述: 日期展示格式
- 类型: 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD'
- 默认值: 'YYYY-MM-DD HH:mm:ss'

## `formatParams`

- 描述: 日期转化成参数格式
- 类型: 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD'
- 默认值: 'YYYY-MM-DD HH:mm:ss'

## `startTime`

- 描述: 开始时间
- 类型: moment.Moment | null
- 默认值: null

## `endTime`

- 描述: 结束时间
- 类型: moment.Moment | null
- 默认值: null

## `disabled`

- 描述: 禁止状态
- 类型: [boolean, boolean]
- 默认值: [false, false]

## `placeholder`

- 描述: 输入框提示文字
- 类型: [string, string]
- 默认值: ['开始时间', '结束时间']

## `dateDict`

- 描述: 预设时间字典。可以根据实际选取，或者新增
- 类型:

```ts
Array< 'today' | 'yesterday' | 'recentThreeDays' | 'thisWeek' | 'recentSevenDays' | 'recentFifteenDays' | 'thisMonth' | 'recentThirtyDays' | 'thisQuarter' | 'recentHalfYear' | 'thisYear' | 'recentYear' | { value: string; label: string; getTimes: () => [moment.Moment, moment.Moment]; }>
```

- 默认值:

```ts
[
  'today',
  'yesterday',
  'recentThreeDays',
  'thisWeek',
  'recentSevenDays',
  'recentFifteenDays',
  'thisMonth',
  'recentThirtyDays',
  'thisQuarter',
  'recentHalfYear',
  'thisYear',
  'recentYear',
];
```

> 自定义:

```ts
import moment from 'moment';

{
    value: 'today',
    label: '今天',
    getTimes() {
      return [
        moment()
          .startOf('day'),
        moment()
          .endOf('day'),
      ];
    },
}
```

## [其他](./filter-base#filterbase)
