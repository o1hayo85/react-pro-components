import { Anchor, Button, Collapse, Dropdown, Layout, Menu, Popover, Space, Tabs, Typography } from 'antd';
import classNames from 'classnames';
import type { FilterItem, FilterItemOptions } from 'egenie-common';
import { ENUM_FILTER_ITEM_TYPE, filterComponentFactory, filterInstanceFactory } from 'egenie-common';
import { autorun, computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { MainSubStructure } from '../egGrid';
import { AddProgrammeModal } from './addProgrammeModal';
import { FilterItemSettingModal } from './filterItemSetting';
import type { Programme } from './programme';
import { filterItemsCollapsePrefix } from './programme';
import styles from './programme.less';

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
    this.initParamsBgActive();

    document.querySelector(`.${styles.scrollContainer}`)
      ?.addEventListener('click', this.props.store.clickPreventCloseScroll);
    window.addEventListener('click', this.props.store.clickCloseScroll, true);
  }

  componentWillUnmount() {
    if (this.paramsDisposer) {
      this.paramsDisposer();
    }

    document.querySelector(`.${styles.scrollContainer}`)
      ?.removeEventListener('click', this.props.store.clickPreventCloseScroll);
    window.removeEventListener('click', this.props.store.clickCloseScroll);
  }

  private paramsDisposer?: () => void;

  public initParamsBgActive = () => {
    this.paramsDisposer = autorun(() => {
      const totalField: string[] = this.props.store.filterItems.actualData.map((item) => item.field);
      const paramsField: string[] = this.props.store.filterItems.actualData.filter((item) => Object.keys(item.toParams.call(item)).length > 0)
        .map((item) => item.field);
      const paramsActiveClassName = styles.paramActive;

      totalField.forEach((field) => {
        const element: HTMLDivElement = document.querySelector(`#${filterItemsCollapsePrefix}${field}`);
        if (element) {
          element.classList.remove(paramsActiveClassName);
        }
      });

      paramsField.forEach((field) => {
        const element: HTMLDivElement = document.querySelector(`#${filterItemsCollapsePrefix}${field}`);
        if (element) {
          element.classList.add(paramsActiveClassName);
        }
      });
    });
  };

  render() {
    const {
      className = '',
      style = {},
      summaryStatistic,
      store,
    } = this.props;
    const {
      scrollContainerRef,
      handleScroll,
      collapsed,
      handleCollapsed,
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
      isSearch,
      handleSearch,
      createProgramme,
      handleShowProgramme,
      showProgramme,
      handleShowSetting,
      showSetting,
      handleSettingSave,
      originSettingData,
      activeProgrammeId,
      programmeList,
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
              activeProgrammeId === programmeList[0].id ? (
                <Button onClick={() => handleShowProgramme(true)}>
                  生成方案
                </Button>
              ) : (
                <Dropdown.Button
                  onClick={() => handleShowProgramme(true)}
                  overlay={(
                    <Menu onClick={() => editProgramme()}>
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
        {
          showProgramme ? (
            <AddProgrammeModal
              callback={createProgramme}
              onCancel={() => handleShowProgramme(false)}
            />
          ) : null
        }
        {
          showSetting ? (
            <FilterItemSettingModal
              callback={handleSettingSave}
              initSettingData={initSettingData}
              onCancel={() => handleShowSetting(false)}
              originData={originSettingData}
            />
          ) : null
        }
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
      showProgrammeCount,
      programmeCount,
      getProgrammeCount,
      isProgrammeCountLoading,
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
              key={programmeList[0].id}
              tab={(
                <section className={classNames(styles.programmeContentContainer, { [styles.active]: programmeList[0].id === activeProgrammeId })}>
                  <Typography.Text
                    ellipsis
                    title={programmeList[0].schemeName}
                  >
                    {programmeList[0].schemeName}
                  </Typography.Text>
                </section>
              )}
            />
            {
              programmeList.slice(1)
                .map((item) => {
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
                            {
                              showProgrammeCount ? (
                                <span className={styles.programmeCount}>
                                  {programmeCount[item.id] || 0}
                                </span>
                              ) : null
                            }
                            <span
                              className={styles.del}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleItemDelete(item);
                              }}
                            >
                              x
                            </span>
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
          {
            showProgrammeCount ? (
              <div className={styles.programmeCountRefresh}>
                <Button
                  icon={<i className="icon-replace"/>}
                  loading={isProgrammeCountLoading}
                  onClick={getProgrammeCount}
                  type="link"
                >
                  刷新
                </Button>
              </div>
            ) : null
          }
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
      showScroll,
      scrollContainerRef,
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
                href={`#${filterItemsCollapsePrefix}${item.field}`}
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
                id={`${filterItemsCollapsePrefix}${item.field}`}
                key={item.field}
              >
                {
                  item.type === ENUM_FILTER_ITEM_TYPE.radio || item.type === ENUM_FILTER_ITEM_TYPE.checkbox ? (
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
    } else {
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
