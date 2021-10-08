import { Tabs } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import styles from './layoutMenu.less';
import type { LayoutStore } from './layoutStore';

const { TabPane } = Tabs;

@inject('layoutStore')
@observer
export class HeaderTabs extends React.Component<{ layoutStore?: LayoutStore; }> {
  render() {
    const {
      handleTabRemove,
      tabList,
      activeTabKey,
      handleTabChange,
    } = this.props.layoutStore;
    return (
      <Tabs
        activeKey={String(activeTabKey)}
        hideAdd
        id={styles.headerTabs}
        onChange={handleTabChange}
        onEdit={handleTabRemove}
        tabBarGutter={0}
        type="editable-card"
      >
        {tabList.map((item, index) => (
          <TabPane
            closable={index !== 0}
            key={item.id}

            tab={(
              <span className={styles.tabContent}>
                <span className={`${styles.tabIcon} icon-${item.icon}`}/>
                <span className={styles.headerTabItem}>
                  {item.name}
                </span>

              </span>
            )}
          />
        ))}
      </Tabs>
    );
  }
}
