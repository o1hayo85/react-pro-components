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

  /**
   * 菜单ID，可自定义
   */
  id: string | number;

  /**
   * 菜单的名字，非菜单可以自定义
   */
  name: string;

  /**
   * 菜单的地址
   */
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

  /**
   * 菜单ID
   */
  id: number;

  /**
   * 查询参数
   * 例如：'name=123&sex=1'
  */
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

export interface Project {
  name: string;
  value: string;
}
