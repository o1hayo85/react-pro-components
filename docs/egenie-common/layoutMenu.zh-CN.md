---
title: 菜单布局
order: 4
---

## 前提

- egenie-common 版本大于等于 0.11.0

## 动机

- 解决原来组件的一些问题
- 对组件重新设计，改进不合理的地方
- 组件只做最底层逻辑，上层由业务层自己做(右侧用户信息等)

## LayoutMenu

### props

- rightContent
  - 描述: 右侧用户信息等
  - 类型?: React.ReactNode
  - 默认值: 无
- children
  - 描述: 首页内容
  - 类型?: React.ReactNode
  - 默认值: 无
- className
  - 描述: layout 的 className
  - 类型?: string
  - 默认值: 无
- style
  - 描述: layout 的 style
  - 类型?: React.CSSProperties
  - 默认值: 无

## layoutMenuStore

### 构造函数参数

```ts
interface LayoutMenuStoreParams {
  logo?: string;
  title?: string;
  projectName?: string;
  animationDuration?: number;
}
```

- logo
  - 描述: 菜单上方 logo 的 url 地址（优先级大于 title）
  - 类型?: string
  - 默认值: null
- title
  - 描述: 菜单上方 title
  - 类型?: string
  - 默认值: E 精灵
- projectName
  - 描述: 项目英文名称
  - 类型?: string
  - 默认值: egenie-erp-home
- animationDuration
  - 描述: 子菜单、mask 的动画时间
  - 类型?: number
  - 默认值: 192

### 简介

- handleInit---初始化数据函数
  - getUserInfo---获取用户信息
  - getMenuList---获取菜单
  - handleOpenPage---初始化通过 url 参数 pageId 来打开新的页面
  - handleWindow---挂载全局方法
  - getPerms---获取权限
- paramsContainer
  - 描述: 参数接收容器
  - 类型: Array<(menuItem?: MenuItem) => string>
  - 默认值: []

```ts
interface MenuItem {
  id: number | string;
  children?: MenuItem[];
  name: string;
  url?: string;
  icon?: string;
  parentId?: number;
  newUrl?: string;
  oldUrl?: string;
}
```

- `根据页面去设置增加的参数,参数格式和原来的没变`

```ts
import { LayoutMenuStore } from 'egenie-common';

const layoutMenuStore = new LayoutMenuStore();
layoutMenuStore.paramsContainer.push((menuItem) => {
  return 'age=10';
});
```

- handleLogout---退出登陆(内部提供方法)

## 公共组件

- `PasswordModal`---修改密码 Modal

## 使用例子

- `index.tsx导出的就是首页的路由`

### index.less

```less
.headerUser {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  max-width: 600px;
  height: 40px;
  margin-right: 20px;
  line-height: 40px;

  img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    border-radius: 12px;
  }

  .name {
    cursor: pointer;
  }
}
```

### index.tsx

```ts
import { LayoutMenu, LayoutMenuStore } from 'egenie-common';
import { Provider } from 'mobx-react';
import React from 'react';
import { UserInfo } from './userInfo';

function Dashboard() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '40px',
        left: '60px',
        width: 'calc(100% - 60px)',
        height: 'calc(100% - 40px)',
      }}
    >
      <img
        src="https://front.ejingling.cn/pc/ts/egenie-cloud-wms/others/wmsHome.png"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}

const layoutMenuStore = new LayoutMenuStore({ logo: 'https://front.ejingling.cn/pc/ts/egenie-common/images/wmsLogo.png' });
layoutMenuStore.handleInit();

export default function () {
  return (
    <Provider layoutMenuStore={layoutMenuStore}>
      <LayoutMenu rightContent={<UserInfo />}>
        <Dashboard />
      </LayoutMenu>
    </Provider>
  );
}
```

### userInfo.tsx

```ts
import { Dropdown, Menu } from 'antd';
import type { LayoutMenuStore } from 'egenie-common';
import { PasswordModal } from 'egenie-common';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import styles from './index.less';

@inject('layoutMenuStore')
@observer
export class UserInfo extends React.Component<{ layoutMenuStore?: LayoutMenuStore }> {
  @observable public showPassword = false;

  @action public handlePasswordOpen = () => {
    this.showPassword = true;
  };

  @action public handlePasswordClose = () => {
    this.showPassword = false;
  };

  render() {
    const {
      showPassword,
      handlePasswordOpen,
      handlePasswordClose,
      props: {
        layoutMenuStore: { userInfo, handleLogout, handleOpenTab },
      },
    } = this;
    return (
      <div className={styles.headerUser}>
        <Dropdown
          className={styles.name}
          overlay={
            <Menu>
              <Menu.Item onClick={() => handleOpenTab('/egenie-ts-baseinfo/exportList/index', 'export_task_center', '导入导出任务中心', 'zc_pfs')}>导入导出任务中心</Menu.Item>
              <Menu.Item onClick={() => handleOpenTab('/page/system/account_center/index.html', 'account_center', '店铺账户中心', 'zc_pfs')}>店铺账户中心</Menu.Item>
              <Menu.Item onClick={handlePasswordOpen}>修改密码</Menu.Item>
              <Menu.Item onClick={handleLogout}>退出登录</Menu.Item>
            </Menu>
          }
          placement="bottomLeft"
        >
          <div>
            <img src="https://front.ejingling.cn/pc/ts/egenie-common/images/avator.png" />
            <span>{userInfo.name}</span>
          </div>
        </Dropdown>
        {showPassword ? <PasswordModal callback={handleLogout} onClose={handlePasswordClose} /> : null}
      </div>
    );
  }
}
```
