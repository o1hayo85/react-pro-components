---
title: 其他
order: 2
---

## `history`

- [react-router-dom 的 history 对象](https://reactrouter.com/web/api/history)
  > 示例:

```ts
import { history } from 'egenie-common';

console.log(history);
```

## ajax 封装

### `request`

- `如果返回满足以status或者success字段区分成功，不需要再手动判断请求是否成功，和给出错误提示`
- [axios.request](https://github.com/axios/axios#request-config)---`Request Config`
- 签名

```ts
import { AxiosRequestConfig } from 'axios';
/**
 * @param options axios配置
 */
export declare function request<T = unknown>(options?: AxiosRequestConfig): Promise<T>;
```

### BaseData

- 常见的后端数据返回结构

```ts
export interface BaseData<T = unknown> {
  status?: string;
  info?: string;
  data: T;
}
```

### PaginationData

- 常见的后端分页的数据返回结构

```ts
export interface PaginationData<T = unknown> {
  status?: string;
  info?: string;
  success?: boolean;
  errorMsg?: string;
  errorCode?: number;
  data: {
    list: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPageCount: number;
    calTotalPageCount: number;
    first: number;
  };
}
```

### BatchReportData

- 批量报告的数据返回结构

```ts
export interface BatchReportData<T = unknown> {
  status: string;
  info: string;
  data: {
    total: number;
    successedList: T[];
    successed: number;
    operationName: string;
    failed: number;
    list?: T[];
    failedList?: T[];
  };
}
```

> `get请求(参数放在params)`

```ts
import { request, BaseData } from 'egenie-common';

request<BaseData<number>>({
  url: 'path',
  params: { age: 18 },
}).then((info) => {
  console.log(info);
});
```

> `post表单请求(建议用URLSearchParams对象处理data)`

```ts
import { request, PaginationData } from 'egenie-common';

request<PaginationData<{ age: 10 }>>({
  url: 'path',
  method: 'POST',
  data: new URLSearchParams(
    Object.entries({
      page: '10',
      vo: JSON.stringify({}),
    }),
  ),
}).then((info) => {
  console.log(info);
});
```

> `常规post请求(content-type是json格式)`

```ts
import { request, BaseData } from 'egenie-common';

request<BaseData<string>>({
  url: 'path',
  method: 'POST',
  data: { age: 10 },
}).then((info) => {
  console.log(info);
});
```
