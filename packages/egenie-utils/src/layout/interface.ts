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

export interface Egenie {
  openTab: (url: string, tabId: number | string, tabName: string, icon?: string) => void;
  openTabId: (id: number, params?: string) => void;
  closeTab: (tabId: number | string) => void;
}

export interface Opera {
  id: string | number;
  name: string;
  url?: string;
  callback?: () => void;
}

export interface Permission {
  checkPermit: (iframe, iframeId?) => void;
  permissionList: string[];
  getResourceId: (iframe, iframeId?) => number | string;
  hasPermit: (iframe, permission: number | string) => boolean;
}

export interface SrcParams {
  id: number;
  params: string;
}

export interface Response {
  status: string;
  data?: unknown;
}

export interface Menudata {
  id: number | string;
  children?: Menudata[];
  name: string;
  url?: string;
  icon?: string;
  parentId?: number;
}

export interface API {
  data?: string[];
  status: string;
}
