import { Menu, Layout } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import styles from './layoutMenu.less';
import { LayoutMenuHeaderTabs } from './layoutMenuHeaderTabs';
import type { LayoutMenuStore } from './layoutMenuStore';
import { immutableStyle } from './layoutMenuStore';
import type { MenuItem } from './types';

let i = 0;

@inject('layoutMenuStore')
@observer
class Logo extends React.Component<{ layoutMenuStore?: LayoutMenuStore; }> {
  render() {
    const {
      tabList,
      handleOpenActiveTab,
      title,
      logo,
    } = this.props.layoutMenuStore;

    if (logo) {
      return (
        <div className={styles.logoImg}>
          <img
            onDragStart={(e) => e.preventDefault()}
            src={logo}
            style={{ width: '100%' }}
          />
        </div>
      );
    } else {
      return (
        <div
          className={styles.rootLayoutLogo}
          onClick={() => handleOpenActiveTab(tabList[0])}
        >
          {title}
        </div>
      );
    }
  }
}

@inject('layoutMenuStore')
@observer
class MenuComponent extends React.Component<{ layoutMenuStore?: LayoutMenuStore; }> {
  render() {
    const {
      menuData,
      activeMenuId,
      handleToggleSubMenu,
      togglePanel,
    } = this.props.layoutMenuStore;

    return (
      <Menu
        mode="inline"
        subMenuCloseDelay={0}
        theme="dark"
      >
        {
          menuData.map((item) => (
            <Menu.Item
              className={`${styles.menuItem} ${item.id === activeMenuId && styles.selected}`}
              key={item.id}
              onClick={() => {
                togglePanel(true);
                handleToggleSubMenu(true, item.id);
              }}
              onMouseEnter={() => {
                handleToggleSubMenu(true, item.id);
              }}
            >
              <img
                id={styles.menuIcon}
                src={`https://front.ejingling.cn/pc/ts/egenie-cloud-wms/menu/${item.icon}`}
              />
              <span className={styles.menuName}>
                {item.name}
              </span>
            </Menu.Item>
          ))
        }
      </Menu>
    );
  }
}

@inject('layoutMenuStore')
@observer
class ContentComponent extends React.Component<{ layoutMenuStore?: LayoutMenuStore; }> {
  render() {
    const {
      activeTabKey,
      tabList,
    } = this.props.layoutMenuStore;

    return (
      <Layout.Content>
        <div
          id={styles.layoutHome}
          style={{ display: activeTabKey == 0 ? 'block' : 'none' }}
        >
          {this.props.children}
        </div>
        {
          tabList.map((item, index) => (
            <iframe
              className={styles.layoutIframe}
              frameBorder={0}
              id={`${item.id}`}
              key={item.id}
              src={item.url}
              style={{ display: (item.id == activeTabKey && index > 0) ? 'block' : 'none' }}
              title={item.name}
            />
          ))
        }
      </Layout.Content>
    );
  }
}

@inject('layoutMenuStore')
@observer
class SubMenu extends React.Component<{ layoutMenuStore?: LayoutMenuStore; }> {
  render() {
    const {
      layoutMenuStore: {
        subMenuList,
        handleToggleSubMenu,
        showSubMenu,
        animationDuration,
      },
    } = this.props;
    const layoutWidth = subMenuList.length * immutableStyle.blockWidth;
    return (
      <div
        className={styles.rootSubMenu}
        style={{
          visibility: showSubMenu ? 'visible' : 'hidden',
          transition: `visibility ${animationDuration}ms`,
        }}
      >
        <div
          className={styles.rootSubMenuContent}
          style={{
            width: showSubMenu ? layoutWidth : 0,
            transition: `width ${animationDuration}ms`,
          }}
        >
          {
            subMenuList.map((list) => (
              <div
                className={styles.rootSubMenuLine}
                key={i++}
                style={{ paddingTop: immutableStyle.subMenuTop }}
              >
                {
                  list?.map((item) => (
                    <div
                      className={styles.rootSubMenuBlock}
                      key={String(item.id)}
                      style={{ width: immutableStyle.blockWidth }}
                    >
                      <div
                        className={styles.rootSubMenuBlockTitle}
                        style={{
                          marginBottom: `${immutableStyle.titleMargin}px`,
                          fontSize: `${immutableStyle.titleHeight}px`,
                          lineHeight: `${immutableStyle.titleHeight}px`,
                        }}
                      >
                        {item.name}
                      </div>
                      {
                        item.children.map((menuItem) => (
                          <div
                            className={styles.rootSubMenuBlockList}
                            key={menuItem.id}
                            style={{ marginBottom: `${immutableStyle.itemMargin}px` }}
                          >
                            <div className={`${styles.rootSubMenuBlockIcon} icon-${menuItem.icon}`}/>
                            <SubMenuItem menuItem={menuItem}/>
                          </div>
                        ))
                      }
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
        <div
          className={styles.rootSubMenuMask}
          onMouseEnter={() => handleToggleSubMenu(false, null)}
          style={{
            opacity: showSubMenu ? 0.5 : 0,
            transition: `opacity ${animationDuration}ms`,
          }}
        />
      </div>
    );
  }
}

@inject('layoutMenuStore')
@observer
class SubMenuItem extends React.Component<{ layoutMenuStore?: LayoutMenuStore; menuItem: MenuItem; }> {
  render() {
    const {
      layoutMenuStore: { handleOpenActiveTab },
      menuItem,
    } = this.props;
    const commonStyle = {
      fontSize: `${immutableStyle.itemHeight}px`,
      lineHeight: `${immutableStyle.itemHeight}px`,
    };

    if (menuItem.url?.includes('http')) {
      return (
        <a
          className={styles.rootSubMenuBlockItem}
          href={menuItem.url}
          rel="noreferrer"
          style={{
            color: '#253041',
            ...commonStyle,
          }}
          target="_blank"
        >
          {menuItem.name}
        </a>
      );
    } else {
      return (
        <div
          className={styles.rootSubMenuBlockItem}
          onClick={() => handleOpenActiveTab(menuItem)}
          style={commonStyle}
        >
          {menuItem.name}
        </div>
      );
    }
  }
}

export interface LayoutMenuProps {
  rightContent?: React.ReactNode;
}

export const LayoutMenu: React.FC<LayoutMenuProps> = function(props) {
  const {
    rightContent,
    children,
  } = props;

  return (
    <Layout
      className={styles.layoutMainContainer}
      hasSider
    >
      <Layout.Sider
        id={styles.rootSider}
        width="60"
      >
        <Logo/>
        <MenuComponent/>
      </Layout.Sider>
      <Layout className={styles.layoutRight}>
        <Layout.Header className={styles.layoutHeader}>
          <LayoutMenuHeaderTabs/>
          {rightContent}
        </Layout.Header>
        <ContentComponent children={children}/>
      </Layout>
      <SubMenu/>
    </Layout>
  );
};

