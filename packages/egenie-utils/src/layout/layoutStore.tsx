import { message } from 'antd';
import _ from 'lodash';
import { action, observable } from 'mobx';
import qs from 'qs';
import { getPerms } from '../permission';
import type { BaseData } from '../request';
import { request } from '../request';
import type { API, Egenie, Menudata, Permission, Response, SrcParams, User, HomePageType } from './interface';
import { EnumVersion } from './interface';

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

export class LayoutStore {
  constructor() {
    this.handleInit();
  }
  public srcParams: SrcParams[] = [];

  @observable public project = {
    name: 'E精灵',
    value: 'egenie-erp-home',
  }
  ;

  @observable public haveDashboard: false; // 是否展示dashboard, false首页则展示空白页

  @observable public isHoverShowPanel = false; // 是否hover展示子菜单，解决频繁展开子菜单问题

  @observable public userInfo: Partial<User> = {};

  @observable public showSubMenu = false;

  @observable public activeMenuId = null;

  @observable public activeSubMenuId: number;

  @observable public menuData: Array<Partial<Menudata>> = [];

  @observable public activeTabKey: string | number = 0; // 导航栏激活tab,默认首页

  @observable public tabList: Array<Partial<Menudata>> = [
    {
      id: 0,
      name: '首页',
      icon: 'index',
    },
  ]; // 导航栏列表

  @observable public showPassord = false;

  @observable public passwordFormInstance: unknown;

  @observable public homePageTypes: HomePageType[] = [];

  @observable public homePageType = null; // 首页(账户)类型，1:零售商,2:供应商

  public immutableStyle = {
    titleHeight: 16,
    titleMargin: 30,
    itemHeight: 14,
    itemMargin: 24,
    blockMargin: 86,
    blockWidth: 240,
    lineTop: 74,
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
        const list = EgeniePermission.permissionList;
        const resourceId = EgeniePermission.getResourceId(iframe, iframeId);
        if (!resourceId) {
          return;
        }
        console.log(resourceId, 'resourceId');
        const ele = iframe.document.querySelectorAll('[permission]');
        ele.forEach((item) => {
          const id = item.getAttribute('permission');
          if (list.includes(`${resourceId}${id}`)) {
            return null;
          }

          item.remove();
        });
      },
      getResourceId(iframe, iframeId) {
        return iframeId ? `${iframeId}_` : `${iframe.frameElement.id}_`;
      },

      hasPermit(iframe, permission) {
        const list = EgeniePermission.permissionList;
        const resourceId = EgeniePermission.getResourceId(iframe);

        if (!resourceId) {
          return null;
        }

        return list.includes(`${resourceId}_${permission}`);
      },
    };
    window.top.EgeniePermission = EgeniePermission;
  };

  @action public getHomePageTypes = async(): Promise<void> => {
    const res: BaseData<HomePageType[]> = await request({ url: '/api/iac/resource/homePage/types' });
    const currentHomePageType = res.data.find((item) => item.current);
    this.homePageTypes = res.data;
    this.homePageType = currentHomePageType ? currentHomePageType.homePageType : null;
    this.getMenuList(this.homePageType);
  };

  @action public switchHomePageType = async(): Promise<void> => {
    const newType = this.homePageType === 1 ? 2 : 1;
    const next = this.homePageTypes.find((item) => item.homePageType === newType);
    this.homePageType = newType;
    await request({ url: `/api/iac/resource/update/homePageType?homePageType=${newType}` });
    next && window.location.replace(next.indexUrl);
  };

  @action public toggleVersion: Egenie['toggleVersion'] = async(resourceId, versionType, params = '') => {
    let menuItem: Partial<Menudata>;
    (function dfs(data: Array<Partial<Menudata>>) {
      (data || []).forEach((item) => {
        if (Number(item.id) === Number(resourceId)) {
          menuItem = item;
        } else {
          // @ts-ignore
          // FIXME 菜单树的数据第一层的children结构被处理成二维数组了，暂时不敢动原来逻辑
          if (item && item.length) {
            // @ts-ignore
            dfs(item);
          }

          if (item.children && item.children.length) {
            dfs(item.children);
          }
        }
      });
    })(this.menuData);

    if (menuItem) {
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
        this.getActiveSubMenu({
          url: combineUrl(menuItem.url, params),
          id: menuItem.id,
          name: menuItem.name,
          icon: menuItem.icon,
        }, this.srcParams);
      }
    } else {
      throw new Error(`${resourceId}: 不存在`);
    }
  };

  public handleInit = () => {
    this.getHomePageTypes();
    this.getUserInfo();
    getPerms();
    this.handleDefaultOpenPage();
    this.handleWindow();

  };
  public setProject = action((project) => {
    if (project) {
      this.project = project;
    }
  });

  public getUserInfo = action(async() => {
    const res: User = await request({ url: '/api/dashboard/user' });
    top.user = res;
    this.userInfo = res;
  });

  // 别的页面跳到erp & 带有菜单参数
  public handleDefaultOpenPage = action(() => {
    const { href } = window.location;
    const hrefArr = href.split('?');
    const params = qs.parse(hrefArr[1]);
    if (!params.pageId) {
      return;
    }
    this.handleOpenTabId(Number(params.pageId));
  });

  // 根据菜单id 打开菜单
  public handleOpenTabId = action((id: number, params?: string) => {
    request<BaseData<{ resource?: { resourceUrl?: string; resourceName?: string; icon: string; id: string | number; }; }>>({ url: `/api/iac/resource/getResource/${id}` })
      .then((res): void => {
        if (!res.data || !res.data.resource) {
          return;
        }
        const { resource } = res.data;
        this.handleOpenTab(`${resource.resourceUrl}?${params}`, resource.id, resource.resourceName, resource.icon);
      })
      .catch(() => {
        return { resource: null };
      });
  });

  public handleToggleSubMenu = action((flag: boolean, id) => {
    if (!this.isHoverShowPanel) {
      return;
    }
    this.togglePanel(flag);
    this.showSubMenu = flag;
    if (!flag) {
      setTimeout(() => {
        this.activeMenuId = null;
      }, 500);
      return null;
    }
    this.activeMenuId = id;
  });

  // 导航已经打开,更新参数 & 重新加载iframe
  public isOpen = action((id: number | string) => {
    const openTabData: Partial<Menudata> = _.find(this.tabList, (tab) => {
      return tab.id == id; // 存在字符串数字 不能用全等
    });
    return openTabData;
  });

  // 增加 & 更新菜单Tab
  public getActiveSubMenu = action((item, srcParams?: SrcParams[]) => {
    this.activeSubMenuId = item.id;
    this.activeTabKey = item.id;
    this.showSubMenu = false;
    this.togglePanel(false);

    // iframe页面src携带参数
    const haveParams = _.find(srcParams, [
      'id',
      item.id,
    ]);
    const result = {
      ...item,
      url: combineUrl(item.url, haveParams?.params),
    };

    // 定时器解决页面动画卡顿问题
    // 更新tab和iframe
    if (this.isOpen(item.id)) {
      setTimeout(() => {
        this.handleRefresh(result);
      }, 500);
      return;
    }

    // 增加tab和iframe
    setTimeout(() => {
      this.activeMenuId = null;

      // 避免双击重复打开
      if (this.isOpen(result.id)) {
        return;
      }
      this.tabList = [
        ...this.tabList,
        result,
      ];
    }, 500);
  });

  public handleRefresh = (item: Menudata): void => {
    const pageWindow: Partial<HTMLIFrameElement> = document.getElementById(`${item.id}`);
    const { contentWindow } = pageWindow;

    const list = this.tabList.map((tab) => {
      if (tab.id == item.id) {
        if (item.url !== tab.url) {
          return {
            ...tab,
            url: item.url,
          };
        } else {
          contentWindow.location.href = item.url;

          // contentWindow.location.reload();
        }
      }
      return tab;
    });
    this.tabList = list;
  };

  public getMenuList = action(async(homePageType: number) => {
    const res = await request({
      url: '/api/iac/resource/dashboard/menu',
      method: 'POST',
      data: { homePageType },

    });
    this.handleMenuItemHeight(res);
  });

  public handleMenuItemHeight = action((data) => {
    const {
      titleHeight,
      titleMargin,
      itemHeight,
      itemMargin,
      blockMargin,
      lineTop,
    } = this.immutableStyle;
    const titleTotalHeight = titleHeight + titleMargin; // 标题高度+边距
    const itemTotalHeight = itemHeight + itemMargin; // 叶子菜单高度+边距
    const marginBottom = blockMargin; // 菜单间的间距
    const contentHeight = window.innerHeight - lineTop; // 父级可使用高度
    this.menuData = data.map((item) => {
      const result: Menudata[][] = [[]];
      let line = 0; // 列数
      let currentHeight = 0;

      item.children.map((child) => {
        const height = titleTotalHeight + child.children.length * itemTotalHeight + marginBottom - itemMargin;
        currentHeight += height;

        if (currentHeight > contentHeight) {
          line += 1;
          currentHeight = height;
        }
        (result[line] ? result[line] : result[line] = []).push(child);
      });
      return {
        ...item,
        children: result,
      };
    });
  });

  // 加载用户所有权限到前端
  public getUserPerms = (): void => {
    const jsessionId = location.search.substr(1);
    if (jsessionId && jsessionId.includes('JSESSIONID=') && jsessionId.length > 11) {
      document.cookie = `${jsessionId};path=/`;
    }
    request({ url: `/api/iac/role/user/perms?${jsessionId}` })
      .then((res: API) => {
        window.top.EgeniePermission.permissionList = res.data;
      });
  };

  public handleTabRemove = action((key: string) => {
    // tab.id 可能是数字(菜单栏)，可能是字符串(自定义的)
    const panes = this.tabList.filter((tab) => tab.id != key);
    if (!panes.length || this.activeTabKey != key) {
      this.tabList = panes;
      return null;
    }
    let lastIndex = 0;
    this.tabList.forEach((tab, i) => {
      if (tab.id == key) {
        lastIndex = i;
      }
    });
    if (lastIndex === panes.length) {
      this.activeTabKey = panes[lastIndex - 1].id;
    } else {
      this.activeTabKey = panes[lastIndex].id;
    }
    this.tabList = panes;
  });

  public handleTabChange = action(((key: string) => {
    this.activeTabKey = key;
  }));

  /* 其他方式打开页面
     id: 页面id
     name: 页面标题
     url: 页面地址，提供给iframe
     icon: 图标 */
  public handleOpenTab = action((url: string, id: string | number, name: string, icon?: string) => {
    this.getActiveSubMenu({
      id,
      name,
      url,
      icon,
    });
  });

  // 右上角用户信息等
  public handleUserOpertion = action((data, item) => {
    console.log('item.....', data, item);
    switch (data.key) {
      case 'password':
        this.togglePassword(true);
        break;
      case 'exit':
        this.handleLogout();
        break;
      case data.key:
        item.callback && item.callback();

      // default;
    }
  });

  public togglePassword = action((flag: boolean) => {
    this.showPassord = flag;
  });

  public handleChangePassword = action((formInstance) => {
    formInstance.current.validateFields()
      .then(async(values) => {
        const {
          oldPassword,
          newPassword,
        } = values;
        const res: Response = await request({
          url: '/api/iac/user/changePassword',
          method: 'post',
          data: {
            oldPassword,
            newPassword,
          },
        });
        if (!res && res.status !== 'Successful') {
          return message.error(res.data);
        }

        message.success('修改成功，请重新登录！');
        this.togglePassword(false);
        setTimeout(() => {
          this.handleLogout();
        }, 2000);
      })
      .catch((errorInfo) => {
        console.log('errorinfo.....', errorInfo);
      });
  });

  @action public togglePanel = (flag: boolean): void => {
    this.isHoverShowPanel = flag;
  };

  public handleLogout = (): void => {
    window.location.href = `/logout?project=${this.project?.value}`;
  };
}

export const layoutStore = new LayoutStore();

