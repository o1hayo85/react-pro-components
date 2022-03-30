import { message, notification } from 'antd';
import { action, computed, observable } from 'mobx';
import type { BaseData } from '../request';
import { request } from '../request';
import type { Egenie, MenuItem, Permission, User } from './types';
import { EnumVersion } from './types';

function combineUrl(oldUrl: string, params: string): string {
  if (typeof oldUrl === 'string') {
    if (typeof params === 'string' && params.length) {
      if (oldUrl.indexOf('?') === -1) {
        return `${oldUrl}?${params}`;
      } else {
        return `${oldUrl}&${params}`;
      }
    } else {
      return oldUrl;
    }
  } else {
    return '';
  }
}

function getMenuItem(data: MenuItem[], resourceId: string | number): MenuItem | null {
  let menuItem: MenuItem = null;

  (function dfs(data: MenuItem[]) {
    if (!Array.isArray(data) || menuItem) {
      return;
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].id == resourceId) {
        menuItem = data[i];
        return;
      }

      dfs(data[i].children);
    }
  })(data);

  return menuItem;
}

export interface LayoutMenuStoreParams {
  logo?: LayoutMenuStore['logo'];
  title?: LayoutMenuStore['title'];
  projectName?: LayoutMenuStore['projectName'];
  animationDuration?: LayoutMenuStore['animationDuration'];
}

export const immutableStyle = {
  titleHeight: 120,
  titleSize: 16,
  blockVerticalGap: 76,
  blockHorizontalGap: 40,
  blockWidth: 280,
  itemHeight: 40,
  itemSize: 14,
};

export class LayoutMenuStore {
  constructor(params: LayoutMenuStoreParams = {}) {
    if (params.logo) {
      this.logo = params.logo;
    }

    if (params.title) {
      this.title = params.title;
    }

    if (params.projectName) {
      this.projectName = params.projectName;
    }

    if (params.animationDuration) {
      this.animationDuration = params.animationDuration;
    }
  }

  public handleInit = (): void => {
    this.getUserInfo();
    this.getMenuList()
      .then(this.handleOpenPage);
    this.handleWindow();
    this.getPerms();
  };

  private checkTabIsOpened = (id: number | string): boolean => {
    return this.tabList.findIndex((tabItem) => tabItem.id == id) !== -1;
  };

  @action private handleRefresh = (item: MenuItem): void => {
    this.tabList.forEach((tab) => {
      if (tab.id == item.id) {
        if (item.url === tab.url) {
          const pageWindow: Partial<HTMLIFrameElement> = document.getElementById(`${item.id}`);
          if (pageWindow) {
            pageWindow.contentWindow.location.href = item.url;
          }
        } else {
          tab.url = item.url;
        }
      }
    });
  };

  public handleWindow = () => {
    window.top.user = {
      tenantType: '100001,100002,100007,100009',
      name: 'apitest1594122200-1548007',
      tenantId: 1548007,
      mobile: '10012344321',
      admin: true,
      id: 114146,
      pic: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKtiauaOLsibQPgZ6jsc4S61xiaEDKEW4MYMPds0EwAoHdv0BG5RiaeQ6JsBVVdbe4bZbheZlicNtXte6g/132',
      businessType: 1,
      tenantIdMD5: '09e921f003e94c741c815f798b58dd76',
      username: '2200',
    };
    window.top.jsonReader = {
      root: 'data.list',
      page: 'data.page',
      total: 'data.totalPageCount',
      records: 'data.totalCount',
      repeatitems: false,
    };
    window.top.egenie = {
      openTab: this.handleOpenTab, // 打开菜单，需要传入完整的菜单信息
      openTabId: this.handleOpenTabId, // 打开菜单，只需要传入菜单ID
      closeTab: this.handleTabRemove,
      toggleVersion: this.toggleVersion,
    };
    const EgeniePermission: Permission = {
      permissionList: [],
      checkPermit: (iframe, iframeId) => {
        const list = EgeniePermission.permissionList || [];
        const resourceId = EgeniePermission.getResourceId(iframe, iframeId);
        if (resourceId) {
          const element = iframe.document.querySelectorAll('[permission]');
          element.forEach((item: any) => {
            const id = item.getAttribute('permission');
            if (!list.includes(`${resourceId}${id}`)) {
              item.remove();
            }
          });
        }
      },
      getResourceId(iframe, iframeId) {
        return iframeId ? `${iframeId}_` : `${iframe.frameElement.id}_`;
      },

      hasPermit(iframe, permission) {
        const list = EgeniePermission.permissionList || [];
        const resourceId = EgeniePermission.getResourceId(iframe);
        return resourceId && list.includes(`${resourceId}_${permission}`);
      },
    };
    window.top.EgeniePermission = EgeniePermission;
  };

  public handleOpenPage = () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('pageId')) {
      this.handleOpenTabId(Number(searchParams.get('pageId')));
    }
  };

  @observable public permissionList: string[] = [];

  @action public getPerms = () => {
    request<BaseData<string[]>>({ url: '/api/iac/role/user/perms' })
      .then((res) => {
        this.permissionList = res.data || [];
        window.top.EgeniePermission.permissionList = res.data || [];
      });
  };

  // 动画时间-毫秒
  public animationDuration = 16 * 12;

  @observable public paramsContainer: Array<(menuItem?: MenuItem) => string> = [];

  @action public getUserInfo = () => {
    request<User>({ url: '/api/dashboard/user' })
      .then((res) => {
        if (res) {
          window.top.user = res;
          this.userInfo = res;
        }
      });
  };

  @action public getMenuList = async(homePageType?: number) => {
    const menuData = await request<MenuItem[]>({
      url: '/api/iac/resource/dashboard/menu',
      method: 'POST',
      data: { homePageType },
    });
    this.menuData = menuData || [];
  };

  @computed
  public get subMenuList(): MenuItem[][] {
    // 关闭子菜单渲染延迟---菜单文字还在页面渲染
    if (this.isHoverShowPanel === false) {
      return [];
    }

    const {
      titleHeight,
      itemHeight,
      blockVerticalGap,
    } = immutableStyle;
    const contentHeight = window.innerHeight - blockVerticalGap;

    const subMenuList: MenuItem[][] = [];
    let currentRow = -1;
    let currentRowHeight = 0;
    (this.menuData.find((item) => item.id === this.activeMenuId)?.children || []).forEach((child) => {
      const currentSubMenuHeight = titleHeight + child.children.length * itemHeight;

      if (currentRow > -1 && currentRow < subMenuList.length && currentRowHeight + currentSubMenuHeight <= contentHeight) {
        subMenuList[currentRow].push(child);
        currentRowHeight += currentSubMenuHeight;
      } else {
        currentRow++;
        currentRowHeight = currentSubMenuHeight;
        subMenuList[currentRow] = [child];
      }
    });
    return subMenuList;
  }

  @observable public title = 'E精灵';

  @observable public logo: string = null;

  @observable public projectName = 'egenie-erp-home';

  @observable public isHoverShowPanel = false; // 是否hover展示子菜单，解决频繁展开子菜单问题

  @observable public userInfo: Partial<User> = {};

  @observable public showSubMenu = false;

  @observable public activeMenuId: MenuItem['id'] = null;

  @observable public activeSubMenuId: number | string;

  @observable public menuData: MenuItem[] = [];

  @observable public activeTabKey: string | number = 0; // 导航栏激活tab,默认首页

  @observable public tabList: MenuItem[] = [
    {
      id: 0,
      name: '首页',
      icon: 'index',
    },
  ];

  @action public toggleVersion: Egenie['toggleVersion'] = async(resourceId, versionType, params = '') => {
    const menuItem = getMenuItem(this.menuData, resourceId);
    if (menuItem == null) {
      throw new Error(`${resourceId}: 不存在`);
    }

    if (versionType === EnumVersion.oldVersion) {
      menuItem.url = menuItem.oldUrl;
    } else if (versionType === EnumVersion.newVersion) {
      menuItem.url = menuItem.newUrl;
    }

    try {
      await request({
        url: '/api/iac/resource/version/change',
        method: 'POST',
        data: {
          resourceId,
          versionType,
        },
      });
    } finally {
      this.handleOpenActiveTab({
        url: combineUrl(menuItem.url, params),
        id: menuItem.id,
        name: menuItem.name,
        icon: menuItem.icon,
      });
    }
  };

  @action public handleToggleSubMenu = (showSubMenu: boolean, id: MenuItem['id']): void => {
    if (this.isHoverShowPanel === false) {
      return;
    }

    this.togglePanel(showSubMenu);
    this.showSubMenu = showSubMenu;
    if (showSubMenu) {
      this.activeMenuId = id;
    } else {
      setTimeout(() => {
        this.activeMenuId = null;
      }, this.animationDuration);
    }
  };

  @action public handleOpenActiveTab = (item: MenuItem): void => {
    this.activeSubMenuId = item.id;
    this.activeTabKey = item.id;
    this.showSubMenu = false;
    this.togglePanel(false);
    const result = {
      ...item,
      url: this.paramsContainer.reduce((prev, current) => combineUrl(prev, current(item)), item.url),
    };

    // 清除notification、message
    message.destroy();
    notification.destroy();

    if (this.checkTabIsOpened(item.id)) {
      setTimeout(() => {
        this.handleRefresh(result);
      }, this.animationDuration);
    } else {
      setTimeout(() => {
        if (this.checkTabIsOpened(result.id) === false) {
          this.activeMenuId = null;
          this.tabList.push(result);
        }
      }, this.animationDuration);
    }
  };

  @action public handleTabRemove = (key: MenuItem['id']): void => {
    const newTabList = this.tabList.filter((tab) => tab.id != key);
    const deleteIndex = this.tabList.findIndex((tab) => tab.id == key);
    if (deleteIndex !== -1) {
      if (this.activeTabKey == key) {
        if (deleteIndex === this.tabList.length - 1) {
          this.activeTabKey = this.tabList[deleteIndex - 1].id;
        } else {
          this.activeTabKey = this.tabList[deleteIndex + 1].id;
        }
      }
    }
    this.tabList = newTabList;
  };

  @action public handleTabChange = ((key: string): void => {
    this.activeTabKey = key;
  });

  @action public handleOpenTab = (url: MenuItem['url'], id: MenuItem['id'], name: MenuItem['name'], icon?: MenuItem['icon']): void => {
    this.handleOpenActiveTab({
      id,
      name,
      url,
      icon,
    });
  };

  @action public handleOpenTabId = (id: MenuItem['id'], params?: string): void => {
    const menuItem = getMenuItem(this.menuData, id);
    if (menuItem) {
      this.handleOpenActiveTab({
        id: menuItem.id,
        name: menuItem.name,
        icon: menuItem.icon,
        url: combineUrl(menuItem.url, params),
      });
    } else {
      request<BaseData<{ resource?: { resourceUrl?: string; resourceName?: string; icon: string; id: string | number; }; }>>({ url: `/api/iac/resource/getResource/${id}` })
        .then((res) => {
          if (res.data && res.data.resource) {
            this.handleOpenActiveTab({
              url: combineUrl(res.data.resource.resourceUrl, params),
              id: res.data.resource.id,
              name: res.data.resource.resourceName,
              icon: res.data.resource.icon,
            });
          }
        });
    }
  };

  @action public togglePanel = (isHoverShowPanel: boolean): void => {
    this.isHoverShowPanel = isHoverShowPanel;
  };

  public handleLogout = (): void => {
    window.location.href = `/logout?project=${this.projectName}`;
  };
}

