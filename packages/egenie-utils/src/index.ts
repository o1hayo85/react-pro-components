import { Egenie, JsonReader, Permission, User } from './layout/interface';

declare global {
  interface Window {
    user: User;
    jsonReader: JsonReader;
    egenie: Egenie;
    EgeniePermission: Permission;
    __config__: {
      originProject: string;
      [key: string]: any;
    };
  }
}

export * from './helper';
export * from './request';
export * from './renderModal';
export * from './batchReport';
export * from './locale';
export * from './renderRoutes';
export * from './history';
export * from './dragAndDropHOC';
export * from './print';
export * from './programme';
export * from './egGrid';
export * from './addGoodsModal';
export * from './constants';
export * from './slideVerify';
export * from './layout';
export * from './fullModal';
export * from './common';
export * from './loginForm/login';
export * from './loginForm/findPassword';
export * from './loginForm/registry';
export * from './voice';
