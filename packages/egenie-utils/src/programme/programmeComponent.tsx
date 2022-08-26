import { Anchor, Button, Collapse, Dropdown, Layout, Menu, Popover, Space, Tabs, Typography } from 'antd';
import classNames from 'classnames';
import type { FilterItem, FilterItemOptions } from 'egenie-common';
import { ENUM_FILTER_ITEM_TYPE, filterComponentFactory, filterInstanceFactory, RenderByCondition } from 'egenie-common';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { MainSubStructure } from '../egGrid';
import { AddProgrammeModal } from './addProgrammeModal';
import { DEFAULT_PROGRAMME, FILTER_ITEMS_COLLAPSE_PREFIX } from './constants';
import type { Programme } from './programme';
import styles from './programme.less';
import { SortAndDisplaySettingView } from './sortAndDisplaySetting/sortAndDisplaySettingView';

let id = 0;

interface ProgrammeProps {
  store: Programme;
  className?: string;
  style?: React.CSSProperties;
  summaryStatistic?: React.ReactNode;
}

@observer
export class ProgrammeComponent extends React.Component<ProgrammeProps> {
  componentDidMount() {
    const {
      handleFilterItemsValueChangeObserver,
      clickPreventCloseScroll,
      clickCloseScroll,
    } = this.props.store.programmeInteractiveStore;

    handleFilterItemsValueChangeObserver();

    document.querySelector(`.${styles.scrollContainer}`)
      ?.addEventListener('click', clickPreventCloseScroll);
    window.addEventListener('click', clickCloseScroll, true);
  }

  componentWillUnmount() {
    const {
      handleFilterItemsValueChangeDisposer,
      clickPreventCloseScroll,
      clickCloseScroll,
    } = this.props.store.programmeInteractiveStore;

    if (handleFilterItemsValueChangeDisposer) {
      handleFilterItemsValueChangeDisposer();
    }

    document.querySelector(`.${styles.scrollContainer}`)
      ?.removeEventListener('click', clickPreventCloseScroll);
    window.removeEventListener('click', clickCloseScroll);
  }

  render() {
    const {
      className = '',
      style = {},
      summaryStatistic,
      store,
    } = this.props;
    const {
      programmeInteractiveStore: {
        scrollContainerRef,
        handleScroll,
        collapsed,
        handleCollapsed,
      },
      gridModel,
    } = store;
    return (
      <Layout
        className={`${styles.container} ${className}`}
        style={style}
      >
        <Layout.Sider
          collapsed={collapsed}
          collapsedWidth={0}
          collapsible
          onCollapse={handleCollapsed}
          theme="light"
          trigger={<i className={collapsed ? 'icon-sq' : 'icon-zk'}/>}
          width="300"
        >
          <div
            className={`${styles.filterContent} ${styles.filterContentBase}`}
            onScroll={handleScroll}
            ref={scrollContainerRef}
          >
            <FilterItemsComponent programme={store}/>
          </div>
          <FilterItemsScroll programme={store}/>
          <Footer programme={store}/>
        </Layout.Sider>
        <Layout.Content>
          {summaryStatistic}
          <ProgrammeList programme={store}/>
          <div className={styles.tableWrapper}>
            <MainSubStructure store={gridModel}/>
          </div>
        </Layout.Content>
      </Layout>
    );
  }
}

@observer
class Footer extends React.Component<{ programme: Programme; }> {
  render() {
    const {
      filterItems: {
        reset,
        initSettingData,
      },
      programmeFilterItemsSettingStore: {
        handleShowSetting,
        showSetting,
        handleSettingSave,
      },
      isSearch,
      handleSearch,
      createProgramme,
      handleShowAddProgramme,
      showAddProgramme,
      originSettingData,
      activeProgrammeId,
      editProgramme,
    } = this.props.programme;
    return (
      <>
        <div className={styles.footer}>
          <a onClick={() => handleShowSetting(true)}>
            <i className="icon-btn_sz"/>
          </a>
          <Space size={4}>
            {
              activeProgrammeId === DEFAULT_PROGRAMME.id ? (
                <Button onClick={() => handleShowAddProgramme(true)}>
                  生成方案
                </Button>
              ) : (
                <Dropdown.Button
                  onClick={() => handleShowAddProgramme(true)}
                  overlay={(
                    <Menu onClick={editProgramme}>
                      <Menu.Item key="1">
                        更新方案
                      </Menu.Item>
                    </Menu>
                  )}
                  placement="topCenter"
                  trigger={['click']}
                >
                  生成方案
                </Dropdown.Button>
              )
            }
            <Button onClick={reset}>
              重置
            </Button>
            <Button
              loading={isSearch}
              onClick={handleSearch}
              type="primary"
            >
              查询
            </Button>
          </Space>

        </div>
        <RenderByCondition show={showAddProgramme}>
          <AddProgrammeModal
            callback={createProgramme}
            onCancel={() => handleShowAddProgramme(false)}
          />
        </RenderByCondition>
        <RenderByCondition show={showSetting}>
          <SortAndDisplaySettingView
            callback={handleSettingSave}
            description="勾选显示查询项,支持拖动排序"
            initSettingData={initSettingData.map((item) => ({
              primaryKey: item.field,
              label: item.label,
              showItem: item.showItem,
            }))}
            onCancel={() => handleShowSetting(false)}
            originData={originSettingData}
            title="查询项设置"
          />
        </RenderByCondition>
      </>
    );
  }
}

@observer
class ProgrammeList extends React.Component<{ programme: Programme; }> {
  render() {
    const {
      programmeList,
      activeProgrammeId,
      handleItemClick,
      handleItemDelete,
      programmeCountStore: {
        showProgrammeCount,
        programmeCount,
        getProgrammeCount,
        isProgrammeCountLoading,
      },
    } = this.props.programme;

    return (
      <div className={styles.programmeList}>
        <div className={styles.leftContainer}>
          <Tabs
            activeKey={activeProgrammeId}
            onTabClick={handleItemClick}
            size="small"
            type="card"
          >
            <Tabs.TabPane
              key={DEFAULT_PROGRAMME.id}
              tab={(
                <section className={classNames(styles.programmeContentContainer, { [styles.active]: DEFAULT_PROGRAMME.id === activeProgrammeId })}>
                  <Typography.Text
                    ellipsis
                    title={DEFAULT_PROGRAMME.schemeName}
                  >
                    {DEFAULT_PROGRAMME.schemeName}
                  </Typography.Text>
                </section>
              )}
            />
            {
              programmeList.map((item) => {
                return (
                  <Tabs.TabPane
                    key={item.id}
                    tab={(
                      <Popover
                        content={(
                          <FilterItemsTranslate
                            id={`${item.id}`}
                            programme={this.props.programme}
                            schemeValue={item.schemeValue}
                          />
                        )}
                        destroyTooltipOnHide
                        key={id++}
                        placement="bottom"
                      >
                        <section className={classNames(styles.programmeContentContainer, { [styles.active]: `${item.id}` === activeProgrammeId })}>
                          <Typography.Text
                            ellipsis
                            title={item.schemeName}
                          >
                            {item.schemeName}
                          </Typography.Text>
                          <RenderByCondition show={showProgrammeCount}>
                            <span className={styles.programmeCount}>
                              {programmeCount[item.id] || 0}
                            </span>
                          </RenderByCondition>
                          <RenderByCondition show={!item.sysSetting}>
                            <span
                              className={styles.del}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleItemDelete(item);
                              }}
                            >
                              x
                            </span>
                          </RenderByCondition>
                        </section>
                      </Popover>
                    )}
                  />
                );
              })
            }
          </Tabs>
        </div>
        <div className={styles.rightContainer}>
          <Space size={4}>
            {
              showProgrammeCount ? (
                <Button
                  loading={isProgrammeCountLoading}
                  onClick={getProgrammeCount}
                  type="text"
                >
                  <i className="icon-cxsc"/>
                </Button>
              ) : null
            }
          </Space>
        </div>
        <div className={styles.emptyBorder}/>
      </div>
    );
  }
}

@observer
class FilterItemsScroll extends React.Component<{ programme: Programme; }> {
  render() {
    const {
      programmeInteractiveStore: {
        showScroll,
        scrollContainerRef,
      },
      filterItems: { actualData },
    } = this.props.programme;
    return (
      <div
        className={styles.scrollContainer}
        style={showScroll ? {} : {
          height: 0,
          width: 0,
          padding: 0,
          overflow: 'hidden',
        }}
      >
        <div className={styles.scrollContent}>
          <Anchor getContainer={scrollContainerRef.current ? () => scrollContainerRef.current : undefined}>
            {actualData.map((item) => (
              <Anchor.Link
                href={`#${FILTER_ITEMS_COLLAPSE_PREFIX}${item.field}`}
                key={item.field}
                title={item.label}
              />
            ))}
          </Anchor>
        </div>
      </div>
    );
  }
}

@observer
class FilterItemsComponent extends React.Component<{ programme: Programme; }> {
  render() {
    const { actualData } = this.props.programme.filterItems;
    return (
      <div className={styles.filterItemMainContainer}>
        {
          actualData.map((item) => {
            return (
              <div
                className={styles.filterItemContainer}
                id={`${FILTER_ITEMS_COLLAPSE_PREFIX}${item.field}`}
                key={item.field}
              >
                {
                  item.type === ENUM_FILTER_ITEM_TYPE.radio || item.type === ENUM_FILTER_ITEM_TYPE.checkbox || item.type === ENUM_FILTER_ITEM_TYPE.patternSearch ? (
                    <Collapse
                      defaultActiveKey="1"
                      expandIconPosition="right"
                      ghost
                    >
                      <Collapse.Panel
                        header={(
                          <>
                            {
                              item.required ? (
                                <span style={{
                                  color: '#ff4d4f',
                                  paddingTop: 4,
                                }}
                                >
                                  *
                                </span>
                              ) : null
                            }
                            <span>
                              {item.label}
                            </span>
                          </>
                        )}
                        key="1"
                      >
                        {filterComponentFactory(item)}
                      </Collapse.Panel>
                    </Collapse>
                  ) : filterComponentFactory(item)
                }
              </div>
            );
          })
        }
      </div>
    );
  }
}

@observer
class FilterItemsTranslate extends React.Component<{ programme: Programme; id: string; schemeValue: string; }> {
  @computed
  public get translateData(): string[][] {
    if (`${this.props.id}` === this.props.programme.activeProgrammeId) {
      return this.props.programme.filterItems.translateParamsList;
    }

    try {
      const result: FilterItem[] = [];
      const parsedValue = JSON.parse(this.props.schemeValue);
      const originFilterItems = this.props.programme.filterItems.originData;
      originFilterItems.forEach((item) => {
        if (item.field in parsedValue && parsedValue[item.field] !== null && parsedValue[item.field] !== undefined) {
          const options: FilterItemOptions = {
            field: item.field,
            type: item.type,
            label: item.label,
            data: item.data,
          };

          const instance = filterInstanceFactory(options);
          instance.formatValue.call(instance, parsedValue[item.field]);
          if (item.type === ENUM_FILTER_ITEM_TYPE.treeSelect && instance.type === ENUM_FILTER_ITEM_TYPE.treeSelect) {
            instance.treeData = item.treeData;
          }

          if (item.type === ENUM_FILTER_ITEM_TYPE.select && instance.type === ENUM_FILTER_ITEM_TYPE.select) {
            instance.mode = item.mode;
          }
          result.push(instance);
        }
      });

      return result.map((item) => item.translateParams.call(item) as string[])
        .filter((item) => item.length);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  render() {
    return (
      <div className={styles.translateContainer}>
        {
          this.translateData.map((item) => {
            return (
              <section key={id++}>
                <Typography.Text
                  ellipsis
                  title={item[0]}
                >
                  {item[0]}
                </Typography.Text>
                <span>
                  :
                </span>
                <span>
                  {item[1]}
                </span>
              </section>
            );
          })
        }
      </div>
    );
  }
}
