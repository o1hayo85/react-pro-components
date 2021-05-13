import { Provider } from 'mobx-react';
import React from 'react';
import { SrcParams, Opera, Permission } from './interface';
import { LayoutMenu } from './layoutMenu';
import { layoutStore } from './layoutStore';

interface Props {
  children?: React.ReactNode;
  userInfoLeft?: React.ReactNode; // 扩展头部左侧
  userInfoRight?: Opera[]; //  扩展头部右侧下拉列表
  haveDashboard?: boolean; // false,展示默认内容; true,展示图表
  defaultDashboard?: React.ReactNode; // hasveDashboard为false才生效，自定义首页内容
  srcParams?: SrcParams[]; // src携带的参数
}

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
  openTab: layoutStore.handleOpenTab, // 打开菜单，需要传入完整的菜单信息
  openTabId: layoutStore.handleOpenTabId, // 打开菜单，只需要传入菜单ID
  closeTab: layoutStore.handleTabRemove,
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

export const LayoutGuide: React.FC<Props> = (props: Props) => {
  console.log('props.....root', props);
  return (
    <Provider layoutStore={layoutStore}>
      <LayoutMenu
        defaultDashboard={props.defaultDashboard}
        haveDashboard={props.haveDashboard}
        srcParams={props.srcParams}
        userInfoLeft={props.userInfoLeft}

        userInfoRight={props.userInfoRight || []}
      />
    </Provider>
  );
};
