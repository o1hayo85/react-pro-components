import { Button, Tabs, Menu, Dropdown } from 'antd';
import { observer } from 'mobx-react';
import { nanoid } from 'nanoid';
import React from 'react';
import styles from '../egGridStyle.less';
import { EgGrid } from '../index';

const { TabPane } = Tabs;

const ButtonHeader = observer(
  ({
    store,
    store: {
      buttons,
      foldModel: { fullScreen },
    },
  }) => {
    return (
      <div
        className={styles.btnHeaderWrap}
        style={{ display: fullScreen ? 'none' : '' }}
      >
        {buttons.map((el) => {
          const { group } = el;
          return group ? (
            <Dropdown.Button
              className={`${styles.headerButtonDropDown} ${el.className || ''}`}
              disabled={el.disabled}
              key={nanoid(5)}
              onClick={el.handleClick.bind(store)}
              overlay={(
                <Menu>
                  {group.map((item) => (
                    <Menu.Item
                      className={`${styles.headerButtonMenu} ${styles.btnHeaderWrap} ${item.className || ''}`}
                      disabled={item.disabled}
                      key={nanoid(5)}
                      onClick={item.handleClick.bind(store)}
                      style={{ ...(item.style || {}) }}
                    >
                      {item.icon ? (
                        <i
                          className={item.icon}
                          style={{ marginRight: 3 }}
                        />
                      ) : null}
                      {item.text}
                    </Menu.Item>
                  ))}
                </Menu>
              )}
              size="small"
              style={{ marginRight: 10 }}
            >
              {el.icon ? (
                <i
                  className={el.icon}
                  style={{
                    marginRight: 3,
                    color: '#1978FF',
                  }}
                />
              ) : null}
              {el.text}
            </Dropdown.Button>
          ) : (
            <Button
              className={styles.headerButton}
              disabled={el.disabled}
              key={nanoid(5)}
              onClick={el.handleClick.bind(store)}
              size="small"
              style={{ ...(el.style || {}) }}
            >
              {el.icon ? (
                <i
                  className={el.icon}
                  style={{
                    marginRight: 3,
                    color: '#20A0FF',
                  }}
                />
              ) : null}
              {el.text}
            </Button>
          );
        })}
      </div>
    );
  }
);

export const MainSubStructure = observer(({ store }) => {
  const { subTablesModel: {
    activeTab, onClickTab, listModel,
  }, foldModel: {
    tabPaneheight,
    onDragStart,
    onDragStop,
  }, hiddenSubTable, buttons, gridModel: mainGridModel } = store;

  const showButtons = Array.isArray(buttons) && buttons.length;
  return (
    <div className={`${styles.mainSubStructureWrap}`}>
      {
        showButtons ? (
          <div className="btnGroup">
            <ButtonHeader store={store}/>
          </div>
        ) : null
      }
      <div className={`${styles.mainContent}`}>
        <EgGrid store={store.gridModel}/>
      </div>
      {!hiddenSubTable && (
        <div
          className={`${styles.dragLine}`}
          draggable
          onDragEnd={onDragStop}
          onDragStart={onDragStart}
        />
      )}
      {!hiddenSubTable && (
        <div className={`${styles.subCotent}`}>
          <Tabs
            activeKey={activeTab}
            className={`${styles.subContentTabs}`}
            defaultActiveKey={activeTab}
            onTabClick={onClickTab}
            style={{ height: tabPaneheight }}
          >
            {
              listModel.map((v) => {
                const { tab: { name, value }, gridModel, isCustom, CustomView, customModel } = v;
                const { cursorRow, primaryKeyField } = mainGridModel;
                const pid = cursorRow?.[primaryKeyField];

                return (
                  <TabPane
                    className={`${styles.subtableContentPane}`}
                    key={value}
                    tab={name}
                  >
                    {
                      isCustom ? (
                        <CustomView
                          cursorRow={cursorRow}
                          pid={pid}
                        />
                      ) : <EgGrid store={gridModel}/>
                    }

                  </TabPane>
                );
              })
            }
          </Tabs>
        </div>
      )}
    </div>
  );
});
