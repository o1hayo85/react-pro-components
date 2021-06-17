import _ from 'lodash';

const NO_EXPIRE = 0;

// eslint-disable-next-line @typescript-eslint/ban-types
type StorageItemValue = string | number | boolean | Object | unknown[];

interface StorageBaseInterface {
  setItem: (key: string, value: StorageItemValue, expire?: number) => boolean;
  getItem: (key: string) => StorageItemValue | undefined;
  keepItemExpire: (key: string, expire?: number) => boolean;
  updateItemExpire: (key: string, expire?: number) => boolean;
  updateItemValue: (key: string, value: StorageItemValue) => boolean;
  removeItem: (key: string) => void;
  clear: () => void;
}

function canJSON(x?: any): boolean {
  return _.isString(x) || _.isNumber(x) || isPureObject(x) || Array.isArray(x) || _.isBoolean(x);
}

function formatExpire(expireTime?: number): number {
  if (_.toSafeInteger(expireTime) === NO_EXPIRE) {
    return NO_EXPIRE;
  } else {
    return _.toSafeInteger(expireTime) + Date.now();
  }
}

function isValid(expireTime: number): boolean {
  if (expireTime === NO_EXPIRE) {
    return true;
  } else {
    return _.isInteger(expireTime) && expireTime - Date.now() > 0;
  }
}

export function isPureObject(x?: any): boolean {
  return Object.prototype.toString.call(x) === '[object Object]';
}

export interface StorageItem {
  value: StorageItemValue;
  expire: number;
}

export interface StorageValue {
  [key: string]: StorageItem;
}

export function clearExpired(storageValue: StorageValue): StorageValue {
  _.forOwn(storageValue, (value: StorageItem, key: string) => {
    if (!isPureObject(value) || !canJSON(value.value) || !isValid(value.expire)) {
      delete storageValue[key];
    }
  });
  return storageValue;
}

export abstract class StorageBase implements StorageBaseInterface {
  constructor(storageKey?: string) {
    this.STORAGE_KEY = storageKey || '__STORAGE__';
  }

  protected STORAGE_KEY: string;

  protected abstract getStorageValue(): StorageValue;

  protected abstract updateStorage(storageValue: StorageValue): StorageValue;

  public get length(): number {
    return Object.keys(this.updateStorage(clearExpired(this.getStorageValue()))).length;
  }

  public setItem(key: string, value: StorageItemValue, expire?: number): boolean {
    const oldValue = clearExpired(this.getStorageValue());
    let isSuccess = false;
    if (canJSON(value)) {
      isSuccess = true;
      oldValue[key] = {
        value,
        expire: formatExpire(expire),
      };
    }

    this.updateStorage(oldValue);
    return isSuccess;
  }

  public getItem(key: string): StorageItemValue | undefined {
    const oldValue = this.updateStorage(clearExpired(this.getStorageValue()));
    if (oldValue[key]) {
      return oldValue[key].value;
    } else {
      return undefined;
    }
  }

  public keepItemExpire(key: string, expire?: number): boolean {
    const oldValue = clearExpired(this.getStorageValue());
    let isSuccess = false;

    if (oldValue[key]) {
      oldValue[key].expire += _.toSafeInteger(expire);
      if (!isValid(oldValue[key].expire)) {
        delete oldValue[key];
      } else {
        isSuccess = true;
      }
    }

    this.updateStorage(oldValue);
    return isSuccess;
  }

  public updateItemExpire(key: string, expire?: number): boolean {
    const oldValue = clearExpired(this.getStorageValue());
    let isSuccess = false;

    if (oldValue[key]) {
      isSuccess = true;
      oldValue[key].expire = formatExpire(expire);
    }

    this.updateStorage(oldValue);
    return isSuccess;
  }

  public updateItemValue(key: string, value: StorageItemValue): boolean {
    const oldValue = clearExpired(this.getStorageValue());
    let isSuccess = false;

    if (oldValue[key] && canJSON(value)) {
      isSuccess = true;
      oldValue[key].value = value;
    }

    this.updateStorage(oldValue);
    return isSuccess;
  }

  public removeItem(key: string): void {
    const oldValue = clearExpired(this.getStorageValue());
    delete oldValue[key];
    this.updateStorage(oldValue);
  }

  public clear(): void {
    this.updateStorage({});
  }
}
