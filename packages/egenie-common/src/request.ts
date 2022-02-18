import { message } from 'antd';
import type { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import axios from 'axios';

const singleton = (function() {
  let instance: AxiosInstance;

  function init(): AxiosInstance {
    const axiosInstance: AxiosInstance = axios.create({
      timeout: 30000,
      timeoutErrorMessage: '请求超时',
      withCredentials: true,

      // 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
      responseType: 'json',
    });

    axiosInstance
      .interceptors
      .request
      .use((config) => {
        const baseHeader: {[key: string]: number | string; } = {};

        if (process.env.REACT_APP_ORIGIN_PROJECT) {
          baseHeader['Origin-Project'] = process.env.REACT_APP_ORIGIN_PROJECT;
        }

        if (process.env.REACT_APP_API_VERSION) {
          baseHeader['Api-Version'] = process.env.REACT_APP_API_VERSION;
        }

        config.headers = {
          ...config.headers,
          ...baseHeader,
        };
        return config;
      }, (error: AxiosError) => {
        message.error(error?.message ?? '请求失败');
        return Promise.reject(error);
      });

    axiosInstance
      .interceptors
      .response
      .use(undefined, (error: AxiosError) => {
        message.error(error?.message ?? '请求失败');
        return Promise.reject(error);
      });

    axiosInstance
      .interceptors
      .response
      .use(responseBaseInterceptors, undefined);

    axiosInstance
      .interceptors
      .response
      .use(wmsResponseInterceptors, undefined);

    function responseBaseInterceptors(info: AxiosResponse) {
      const successfulTag = [
        'RESULT',
        'Successful',
      ];
      if (info.data && Object.prototype.hasOwnProperty.call(info.data, 'status')) {
        if (successfulTag.includes(info.data.status)) {
          return Promise.resolve(info);
        } else if (info.data.status === 'Unauthenticated' || info.data.status === 'redirected') {
          message.error({
            key: '未登录，请重新登录',
            content: '未登录，请重新登录',
          });
          if (process.env.NODE_ENV === 'production') {
            if (typeof top !== 'undefined') {
              top.location.href = info.data.data || '/login';
            } else {
              window.location.href = info.data.data || '/login';
            }
          }
          return Promise.reject(info);
        } else {
          const errorMsg = String(info.data.info || info.data.data || '请求失败');
          message.error({
            key: errorMsg,
            content: errorMsg,
          });
          return Promise.reject(info);
        }
      } else {
        return Promise.resolve(info);
      }
    }

    function wmsResponseInterceptors(info: AxiosResponse) {
      if (info.data && Object.prototype.hasOwnProperty.call(info.data, 'success')) {
        if (info.data.success === true) {
          return Promise.resolve(info);
        } else {
          message.error(info.data.errorMsg || '请求失败');
          return Promise.reject(info);
        }
      } else {
        return Promise.resolve(info);
      }
    }

    return axiosInstance;
  }

  return {
    getInstance(): AxiosInstance {
      if (instance) {
        return instance;
      } else {
        instance = init();
        return instance;
      }
    },
  };
}());

/**
 * 如果返回满足以status或者success字段区分成功，不需要再手动判断请求是否成功，和给出错误提示
 * 对axios的封装。https://github.com/axios/axios
 * @param options axios配置
 */
export function request<T = unknown>(options: AxiosRequestConfig = {}): Promise<T> {
  // 错误情况还需要处理的请自行处理。这里无法处理
  return singleton.getInstance()
    .request<T>(options)
    .then((info) => info.data);
}

/**
 * 常见的后端数据返回结构。以泛型传递给request
 */
export class BaseData<T = unknown> {
  public status?: string;

  public info?: string;

  public data: T;
}

/**
 * 常见的后端分页的数据返回结构。以泛型传递给request
 */
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

/**
 * 批量报告的数据返回结构。以泛型传递给request
 */
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

/**
 * 后端直接返回data对象
 */
export class PureData<T = unknown> {
  public calTotalPageCount: number;

  public first: [];

  public list: T[];

  public page: number;

  public pageSize: number;

  public totalCount: number;

  public totalPageCount: number;
}
