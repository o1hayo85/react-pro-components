import { clearExpired, isPureObject, StorageBase, StorageValue } from './storageBase';

export class LocalStorageExpire extends StorageBase {
  constructor(storageKey?: string) {
    super(storageKey);
    this.updateStorage(clearExpired(this.getStorageValue()));
  }

  protected getStorageValue(): StorageValue {
    try {
      const result = JSON.parse(window.localStorage.getItem(this.STORAGE_KEY));
      if (isPureObject(result)) {
        return result;
      } else {
        return {};
      }
    } catch (e) {
      return {};
    }
  }

  protected updateStorage(storageValue: StorageValue): StorageValue {
    window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storageValue));
    return storageValue;
  }
}
