import { Menu, Layout } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { OSS } from '../constants';
import { HeaderTabs } from './headerTabs';
import { HeaderUserInfo } from './headerUserInfo';
import { Home } from './home';
import { Menudata } from './interface';
import styles from './layoutMenu.less';

const {
  Content,
  Sider,
  Header,
} = Layout;

@inject('layoutStore')
@observer
export class LayoutMenu extends React.Component<any> {
  componentDidMount(): void {
    this.props.layoutStore.handleInit(this.props?.project);
  }

  public openNewPage = (child: Partial<{ url: string; name: string; }>): JSX.Element => {
    const {
      immutableStyle,
      getActiveSubMenu,
    } = this.props.layoutStore;
    const commonStyle = {
      fontSize: `${immutableStyle.itemHeight}px`,
      lineHeight: `${immutableStyle.itemHeight}px`,
    };
    return child.url.includes('http') ? (
      <a
        className={styles.rootSubMenuBlockItem}
        href={child.url}
        rel="noreferrer"
        style={{
          color: '#253041',
          ...commonStyle,
        }}
        target="_blank"
      >
        {child.name}
      </a>
    ) : (
      <div
        className={styles.rootSubMenuBlockItem}
        onClick={getActiveSubMenu.bind(this, child, this.props.srcParams)}
        style={commonStyle}
      >
        {child.name}
      </div>
    );
  };

  render(): JSX.Element {
    const {
      userInfoLeft,
      userInfoRight,
      defaultDashboard,
      project,
    } = this.props;
    const {
      menuData,
      activeMenuId,
      activeTabKey,
      tabList,
      handleToggleSubMenu,
      showSubMenu,
      getActiveSubMenu,
      togglePanel,
      immutableStyle,
    } = this.props.layoutStore;

    const result: Menudata = menuData.filter((item) => item.id === activeMenuId)[0];
    const subMenuList = result ? result.children : [[]];
    const layoutWidth = subMenuList.length * immutableStyle.blockWidth;
    return (
      <div className="rootLayout">
        <Layout hasSider>
          <Sider
            id={styles.rootSider}

            width="60"
          >
            <div
              className={styles.rootLayoutLogo}
              onClick={getActiveSubMenu.bind(this, tabList[0])}
            >
              {project.name}
            </div>
            <Menu
              mode="inline"
              theme="dark"
            >
              {menuData.map((item) => (
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
                    src={`${OSS}/menu/${item.icon}`}
                  />
                  <span className={styles.menuName}>
                    {item.name}
                  </span>
                </Menu.Item>
              ))}
            </Menu>
          </Sider>
          <Layout className={styles.layoutRight}>
            <Header className={styles.layoutHeader}>
              <HeaderTabs/>
              <HeaderUserInfo
                styles={styles}
                userInfoLeft={userInfoLeft}
                userInfoRight={userInfoRight}
              />
            </Header>
            <Content>
              <div
                className={styles.layoutIframe}
                id="layoutIframe"
              >
                <Home defaultDashboard={defaultDashboard}/>
                {tabList.map((item, index) => (
                  <iframe
                    className={styles.layoutIframe}
                    frameBorder={0}
                    id={item.id}
                    key={item.id}
                    src={item.url}
                    style={{ display: (item.id == activeTabKey && index > 0) ? 'block' : 'none' }}
                    title={item.name}
                  />
                ))}
              </div>
            </Content>
          </Layout>
          <div
            className={styles.rootSubMenu}
            style={{ visibility: showSubMenu ? 'visible' : 'hidden' }}
          >
            <div
              className={styles.rootSubMenuContent}
              style={{
                maxWidth: showSubMenu ? 900 : 0,
                width: layoutWidth,
              }}
            >
              {subMenuList.map((list) => (
                <div
                  className={styles.rootSubMenuLine}
                  key="index"
                  style={{ paddingTop: immutableStyle.lineTop }}
                >
                  {list?.map((item) => (
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
                      {item.children.map((child) => (
                        <div
                          className={styles.rootSubMenuBlockList}
                          key={child.id}
                          style={{ marginBottom: `${immutableStyle.itemMargin}px` }}
                        >

                          <div
                            className={`${styles.rootSubMenuBlockIcon} icon-${child.icon}`}
                          />
                          {this.openNewPage(child)}

                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div
              className={styles.rootSubMenuMask}
              onMouseEnter={handleToggleSubMenu.bind(this, false, null)}
              style={{ opacity: showSubMenu ? 0.5 : 0 }}
            />
          </div>
        </Layout>
      </div>
    );
  }
}
