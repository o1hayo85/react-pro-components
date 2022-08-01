---
title: 其他
order: 3
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

### `BaseData`

- 常见的后端数据返回结构

```ts
export class BaseData<T = unknown> {
  public status?: string;

  public info?: string;

  public data: T;
}
```

### `PaginationData`

- 常见的后端分页的数据返回结构

```ts
export class PaginationData<T = unknown> {
  public status?: string;

  public info?: string;

  public success?: boolean;

  public errorMsg?: string;

  public errorCode?: number;

  public data: {
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
export class BatchReportData<T = unknown> {
  public status: string;

  public info: string;

  public data: {
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

### PureData

- 后端直接返回 data 对象

```ts
export class PureData<T = unknown> {
  public calTotalPageCount: number;

  public first: [];

  public list: T[];

  public page: number;

  public pageSize: number;

  public totalCount: number;

  public totalPageCount: number;
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

## 声音

### playVoice

- 描述: 播放声音
- 类型: (url: string) => void
  - url: 声音 url 地址
- 默认值: 无

### getAndPlayVoice

- 描述: 获取声音数据并播放
- 类型: (tex: string, per?: string) => void
  - tex: 语音文本
  - per: 声音类型(默认'0',女声)
- 默认值: 无

> `示例:`

```ts
import { playVoice, getAndPlayVoice } from 'egenie-common';

// 播放声音
playVoice('https://front.runscm.com/customer-source/ring/di.mp3');

// 获取声音数据并播放
getAndPlayVoice('通过');
```

## getStaticResourceUrl

- 描述: 获取静态资源 url(路由前缀由环境变量给)
- 类型: (relativePath: string) => string
  - relativePath: 资源的相对路径

> `示例:`

```ts
import { getStaticResourceUrl } from 'egenie-common';

getStaticResourceUrl('customer-source/ring/di.mp3');
```

## egeniePcTheme

- 描述: pc 的主题(原来 egenie-config 下的 less 的 theme 变量)
- 前提: `egenie-common大于等于0.14.9`
  > `示例:`

```ts
import { egeniePcTheme } from 'egenie-common';

console.log(egeniePcTheme.color);
console.log(egeniePcTheme.font);
console.log(egeniePcTheme.spacing);
```
