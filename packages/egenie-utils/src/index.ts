import type { Egenie, JsonReader, Permission, User } from './layout/interface';

declare global {
  interface Window {
    user: User;
    jsonReader: JsonReader;

    // @ts-ignore
    egenie: Egenie;

    // @ts-ignore
    EgeniePermission: Permission;
  }
}

export * from './request';
export * from './batchReport';
export * from './dragAndDropHOC';
export * from './programme';
export * from './egGrid';
export * from './slideVerify';
export * from './layout';
export * from './fullModal';
export * from './common';
export * from './loginForm/login';
export * from './loginForm/findPassword';
export * from './loginForm/registry';
export * from './searchListStructure';
export * from './permission';
export * from './exportModal';
export * from './importModal';
