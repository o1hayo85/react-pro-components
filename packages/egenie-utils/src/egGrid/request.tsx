import { observable, action } from 'mobx';
import { request } from '../request';

interface ICache {
  (): unknown;
  cache?: unknown;
}
interface IColumnConfig {
  (params: string): Promise<unknown>;
  cache?: unknown;
}
interface IUser {
  username?: string;
  [key: string]: any;
}

export const cache = observable({
  // columnsConfig的缓存，全局用
  value: {},
  setCache: action(({ cacheKey, cacheValue }) => {
    cache.setStorage({
      cacheKey,
      cacheValue,
    });
    if (cache.value[cacheKey] && cache.value[cacheKey] === cacheValue) {
      return;
    }
    cache.value = {
      ...cache.value,
      [cacheKey]: cacheValue,
    };
  }),
  setStorage: action(({ cacheKey, cacheValue }) => {
    const item = localStorage.getItem(cacheKey);
    if (!item || item !== cacheValue) {
      try {
        localStorage.setItem(cacheKey, cacheValue);
      } catch (e) {
        localStorage.clear();
        localStorage.setItem(cacheKey, cacheValue);
      }
    }
  }),
});

export const getUser: ICache = async function getUser(): Promise<IUser> {
  if (!getUser.cache) {
    getUser.cache = request<{ username?: string ; [key: string]: any; }>({
      url: '/api/dashboard/user',
      method: 'get',
    });
  }
  const response = await getUser.cache;
  return response;
};
getUser.cache = '';

export async function saveColumnsConfig(data): Promise<unknown> {
  cache.setCache(data);
  const saveData = `cacheKey=${data.cacheKey}&cacheValue=${data.cacheValue}`;
  const response = await request({
    url: '/api/dashboard/cache/save',
    method: 'post',
    data: saveData,
  });
  return response;
}

export const getColumnsConfig: IColumnConfig = async function getColumnsConfig(params): Promise<any> {
  const item = localStorage.getItem(params);
  if (item) {
    return { data: item };
  }
  if (!getColumnsConfig.cache) {
    getColumnsConfig.cache = {};
  }
  if (!getColumnsConfig.cache[params]) {
    getColumnsConfig.cache[params] = request({
      url: `/api/dashboard/cache/get?cacheKey=${ params}`,
      method: 'get',
    });
  }
  const response = await getColumnsConfig.cache[params];
  return response;
};
getColumnsConfig.cache = '';

