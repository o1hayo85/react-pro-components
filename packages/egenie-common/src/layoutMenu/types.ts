export interface User {
  tenantType: string;
  name: string;
  tenantId: number;
  mobile: string;
  admin: true;
  id: number;
  pic: string;
  businessType: number;
  tenantIdMD5: string;
  username: string;
}

export interface JsonReader {
  root: string;
  page: string;
  total: string;
  records: string;
  repeatitems: boolean;
}

export enum EnumVersion {
  oldVersion = 1,
  newVersion = 2
}

export interface Egenie {
  openTab: (url: string, tabId: number | string, tabName: string, icon?: string) => void;
  openTabId: (id: number | string, params?: string) => void;
  closeTab: (tabId: number | string) => void;
  toggleVersion: (resourceId: number | string, versionType: EnumVersion, params?: string) => Promise<void>;
}

export interface Permission {
  checkPermit: (iframe: any, iframeId?: string | number) => void;
  permissionList: string[];
  getResourceId: (iframe: any, iframeId?: string | number) => number | string;
  hasPermit: (iframe: any, permission: number | string) => boolean;
}

export interface MenuItem {
  id: number | string;
  children?: MenuItem[];
  name: string;
  url?: string;
  icon?: string;
  parentId?: number;
  newUrl?: string;
  oldUrl?: string;
}

