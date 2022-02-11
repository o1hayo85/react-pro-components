import { Tabs } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import styles from './layoutMenu.less';
import type { LayoutMenuStore } from './layoutMenuStore';

@inject('layoutMenuStore')
@observer
export class LayoutMenuHeaderTabs extends React.Component<{ layoutMenuStore?: LayoutMenuStore; }> {
  render() {
    const {
      handleTabRemove,
      tabList,
      activeTabKey,
      handleTabChange,
    } = this.props.layoutMenuStore;
    return (
      <Tabs
        activeKey={String(activeTabKey)}
        hideAdd
        id={styles.headerTabs}
        onChange={handleTabChange}

        // @ts-ignore
        onEdit={handleTabRemove}
        tabBarGutter={0}
        type="editable-card"
      >
        {
          tabList.map((item, index) => (
            <Tabs.TabPane
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
          ))
        }
      </Tabs>
    );
  }
}
