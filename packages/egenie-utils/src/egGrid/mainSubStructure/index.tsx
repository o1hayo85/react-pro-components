import { InfoCircleOutlined, SearchOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Tabs, Menu, Dropdown, Badge, Select, Input, DatePicker } from 'antd';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useEffect } from 'react';
import styles from '../egGridStyle.less';
import { EgGrid } from '../index';

let i = 0;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const ButtonHeader = observer(
  ({
    store,
    store: {
      _buttons,
      foldModel: { fullScreen },
      btnExtraLeft,
      btnExtraRight,
    },
  }) => {
    const overlay = (group) => {
      return (
        <Menu>
          {group.map((item) => (
            <Menu.Item
              className={`${styles.headerButtonMenu} ${styles.btnHeaderWrap} ${item.className || ''}`}
              disabled={item.disabled}
              key={i++}
              onClick={item.handleClick.bind(store)}
              style={{ ...(item.style || {}) }}
            >
              {item.icon ? (
                <i
                  className={item.icon}
                  style={{
                    marginRight: 3,
                    color: '#1978FF',
                  }}
                />
              ) : null}
              {item.text}
            </Menu.Item>
          ))}
        </Menu>
      );
    };
    return (
      <div
        className={styles.btnHeaderWrap}
        style={{ display: fullScreen ? 'none' : '' }}
      >
        {_buttons.map((el) => {
          const { group, type } = el;
          return group ? type === 'dropdown' ? (
            <Dropdown
              key={i++}
              overlay={overlay(group)}
            >
              <Button
                className={`${styles.headerButtonDropDown} ${el.className || ''}`}
                style={{
                  marginRight: 10,
                  height: 30,
                  padding: '5px 8px',
                }}

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
                {' '}
                <DownOutlined/>
              </Button>
            </Dropdown>
          )
            : (
              <Dropdown.Button
                className={`${styles.headerButtonDropDown} ${el.className || ''}`}
                disabled={el.disabled}
                key={i++}
                onClick={el.handleClick.bind(store)}
                overlay={overlay(group)}
                size="small"
                style={{
                  marginRight: 10,
                  ...el.style,
                }}
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
            )
            : (
              <Button
                className={styles.headerButton}
                disabled={el.disabled}
                key={i++}
                onClick={el.handleClick.bind(store)}
                size="small"
                style={{ ...(el.style || {}) }}
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
              </Button>
            );
        })}
        {
          btnExtraLeft && (
            <div className={styles.btnExtraleftWrap}>
              <InfoCircleOutlined
                className={styles.warnIcon}
                style={{ display: btnExtraLeft.isWarnIcon ? 'inline' : 'none' }}
              />
              {btnExtraLeft.text}

              {
                btnExtraLeft.linkBtnText && (
                  <a
                    className={styles.linkBtn}

                    onClick={btnExtraLeft.handleLinkBtnClick || null}
                  >
                    { btnExtraLeft.linkBtnText}

                  </a>
                )
              }

            </div>
          )
        }
        {
          btnExtraRight && (
            <div className={styles.btnExtraRight}>
              {btnExtraRight}
            </div>
          )
        }
      </div>
    );
  }
);

const ButtonsOfSubTable = observer(({ store, store: { _buttons, subbtnExtra }}) => {
  return (
    <div
      className={`${styles.subTableHeaderButtonWrap}`}
    >
      {subbtnExtra}
      {_buttons.length ? _buttons.map((el, index) => {
        const { group } = el;
        return group ? (
          <Dropdown.Button
            className={`${styles.headerButtonDropDown} ${el.className || ''}`}
            disabled={el.disabled}
            key={i++}
            onClick={el.handleClick.bind(store)}
            overlay={(
              <Menu>
                {group.map((item) => (
                  <Menu.Item
                    className={`${styles.headerButtonMenu} ${styles.btnHeaderWrap} ${item.className || ''}`}
                    disabled={item.disabled}
                    key={i++}
                    onClick={item.handleClick.bind(store)}
                    style={{ ...(item.style || {}) }}
                  >
                    {el.icon ? (
                      <i
                        className={el.icon}
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
            key={i++}
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
      }) : null}
    </div>
  );
});

const CollectDataView = observer(({ store: { collectData }}) => {
  return (
    <div>
      <div className={styles.collectWrap}>
        {
          collectData.map(({ name, value, color, style }, index) => {
            return (
              <div
                className={styles.collectDataWrap}
                key={name}
                style={{
                  color: color || '#2b2e3e',
                  ...style,
                }}
              >
                {name}
                ：
                {value}
                {index + 1 < collectData.length ? (
                  <span className={`headerCollectSplit ${styles.collectSplit}`}/>
                ) : null }
              </div>
            );
          })
        }
      </div>
      <div className={styles.splitLine}/>
    </div>
  );
});

const FilterItemsOfSubTable = observer(
  ({
    store: {
      filterItems,
      onFilterValueChange,
      onSearch,
      allFilterItemsInOneGroup,
      cursorFilterItem,
      onCursorFilterItemFieldChange,
      numOfHasValue,
      getDisplayValueOfFilterItem,
    },
  }) => {
    let cursorFilterItemDom: React.ReactNode;
    switch (cursorFilterItem?.type) {
      case 'select': {
        cursorFilterItemDom = (
          <Select
            allowClear
            className={styles.filterSelect}
            key="2"
            onChange={onFilterValueChange.bind(this, cursorFilterItem.field)}
            size="small"
            style={{ marginRight: 10 }}
            value={cursorFilterItem.value}
          >
            {cursorFilterItem.options.map((el) => {
              const { value, label } = el;
              return (
                <Select.Option
                  key={value}
                  label={label}
                  value={value}
                >
                  {
                    label
                  }
                </Select.Option>
              );
            })}
          </Select>
        );
        break;
      }
      case 'date': {
        cursorFilterItemDom = (
          <RangePicker
            allowEmpty={[
              true,
              true,
            ]}
            key="3"
            onChange={(dates, dateStrings) => onFilterValueChange(cursorFilterItem.field, dateStrings)}
            showTime={{
              defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('11:59:59', 'HH:mm:ss'),
              ],
            }}
            size="small"
            style={{ marginRight: 10 }}
            value={cursorFilterItem.value ? [
              cursorFilterItem.value[0] && moment(cursorFilterItem.value[0]),
              cursorFilterItem.value[1] && moment(cursorFilterItem.value[1]),
            ] : undefined}
          />
        );
        break;
      }
    }
    return filterItems && filterItems.length ? (
      <div className={styles.filterWrap}>
        {allFilterItemsInOneGroup
          ? [
            <Badge
              className={numOfHasValue ? '' : 'count0'}
              count={numOfHasValue}
              key="1"
              offset={[
                -135,
                5,
              ]}
              size="small"
            >
              <Select
                className={styles.filterSelect}
                onChange={onCursorFilterItemFieldChange}
                optionLabelProp="label"
                placeholder="请选择"
                size="small"
                value={cursorFilterItem?.field || undefined}
              >
                {filterItems.map((el) => {
                  const { field, label } = el;
                  return (
                    <Select.Option
                      key={field}
                      label={label}
                      value={field}
                    >
                      <span style={{
                        float: 'left',
                        fontSize: 11,
                      }}
                      >
                        {label}
                      </span>
                      <span
                        style={{
                          float: 'right',
                          color: '#ff4949',
                          fontSize: 11,
                          maxWidth: 100,
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}
                      >
                        {getDisplayValueOfFilterItem(el)}
                      </span>
                    </Select.Option>
                  );
                })}
              </Select>
            </Badge>,
            cursorFilterItem && cursorFilterItem.type !== 'input'
              ? cursorFilterItemDom : (
                <Input
                  className={styles.filterSelect}
                  key="2"
                  onChange={(e) => onFilterValueChange(cursorFilterItem?.field, e.target.value)}
                  onKeyUp={(e) => {
                    e.stopPropagation();
                    if (e.keyCode == 13) {
                      onSearch();
                    }
                  }}
                  size="small"
                  style={{ marginRight: 10 }}
                  value={cursorFilterItem?.value || ''}
                />
              ),
          ]
          : filterItems.map((el, index) => {
            const { label, field, type, value, options } = el;
            return (
              <label
                key={field}
                style={{
                  display: 'flex',
                  whiteSpace: 'nowrap',
                  alignItems: 'center',
                  marginRight: 10,
                  width: type === 'date' ? 400 : 170,
                }}
              >
                {`${label }:`}
                {type === 'select' ? (
                  <Select
                    allowClear
                    onChange={onFilterValueChange.bind(this, field)}
                    size="small"
                    style={{
                      marginRight: 10,
                      flex: 'auto',
                    }}
                    value={value}
                  >
                    {options.map((el) => {
                      const { value, label } = el;
                      return (
                        <Select.Option
                          key={value}
                          label={label}
                          value={value}
                        >
                          {
                            label
                          }
                        </Select.Option>
                      );
                    })}
                  </Select>
                ) : type === 'date' ? (
                  <RangePicker
                    allowEmpty={[
                      true,
                      true,
                    ]}
                    onChange={(dates, dateStrings) => onFilterValueChange(field, dateStrings)}
                    showTime={{
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment('11:59:59', 'HH:mm:ss'),
                      ],
                    }}
                    size="small"
                    style={{ marginRight: 10 }}
                    value={value ? [
                      value[0] && moment(value[0]),
                      value[1] && moment(value[1]),
                    ] : undefined}
                  />
                ) : (
                  <Input
                    onChange={(e) => onFilterValueChange(field, e.target.value)}
                    onKeyUp={(e) => {
                      e.stopPropagation();
                      if (e.keyCode == 13) {
                        return onSearch();
                      }
                    }}
                    size="small"
                    style={{ marginRight: 10 }}
                    value={value}
                  />
                )}
              </label>
            );
          })}
        <Button
          className={styles.headerButton}
          icon={<SearchOutlined/>}
          onClick={onSearch}
          size="small"
        >
          查询
        </Button>
      </div>
    ) : null;
  }
);

const HeaderExtraContentOfSubTable = observer(({ store }) => {
  return (
    <div className={`${styles.subTableHeaderWrap}`}>
      <ButtonsOfSubTable store={store}/>
      <FilterItemsOfSubTable store={store}/>
    </div>
  );
});

export const MainSubStructure = observer(({ store }) => {
  useEffect(() => {
    store.getPermission();
  }, []);
  const { subTablesModel: {
    activeTab, onClickTab, listModel, cursorTabModel,
  }, foldModel: {
    tabPaneheight,
    onDragStart,
    onDragStop,
  }, hiddenSubTable, buttons, gridModel: mainGridModel, collectData } = store;

  const showButtons = Array.isArray(buttons) && buttons.length;
  return (
    <div className={`${styles.mainSubStructureWrap}`}>
      {collectData.length ? (
        <CollectDataView store={store}/>
      ) : null}

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
        <Tabs
          activeKey={activeTab}
          className={`${styles.subContentTabs}`}
          defaultActiveKey={activeTab}
          onTabClick={onClickTab}
          style={{ height: tabPaneheight }}
          tabBarExtraContent={<HeaderExtraContentOfSubTable store={cursorTabModel}/>}
        >
          {
            listModel.map((v) => {
              const { tab: { name, value }, gridModel, isCustom, CustomView, customModel } = v;
              const { cursorRow, primaryKeyField } = mainGridModel;
              const pid = cursorRow?.[primaryKeyField];

              return (
                <TabPane
                  className={`${styles.subTableContentPane}`}
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
      )}
    </div>
  );
});
