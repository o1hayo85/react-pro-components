import { Anchor, Button, Collapse, Layout, message, Modal, Typography } from 'antd';
import classNames from 'classnames';
import { action, computed, observable } from 'mobx';
import { inject, observer, Provider } from 'mobx-react';
import React from 'react';
import { MainSubStructure, MainSubStructureModel } from '../egGrid';
import { BaseData, request } from '../request';
import { AddProgrammeModal } from './addProgrammeModal';
import { filterComponentFactory, FilterItem, FilterItems, FilterItemsParams } from './filterItems';
import { FilterItemSettingItem, FilterItemSettingModal } from './filterItemSetting';
import { FilterConfigData, formatFilterConfigData } from './formatFilterConfigData';
import styles from './programme.less';

const filterItemsCollapsePrefix = 'filterItemsCollapsePrefix_';
const filterItemsSettingPrefix = 'filterItemsSettingPrefix_';
const defaultProgrammeName = '默认方案';
const defaultProgramme = [
  {
    scheme_name: defaultProgrammeName,
    scheme_value: JSON.stringify({}),
    display_setting: JSON.stringify({}),
    sys_setting: true,
  },
];

function validParams(params?: Partial<ProgrammeParams>) {
  if (!params.moduleName) {
    throw new Error('moduleName必须传入');
  }
}

export interface ProgrammeListItem {
  scheme_name: string;
  scheme_value: string;
  display_setting: string;
  sys_setting: boolean;
}

export interface ProgrammeParams extends FilterItemsParams {

  /**
   * 查询方案标识。必须传入、否则报错
   */
  moduleName: string;

  /**
   * 字典列表。需要和后端确认。字典需要从方案配置接口获取就传入、不需要就不传入
   */
  dictList: string;

  /**
   * 类似字典列表
   */
  itemList: string;

  /**
   * 字段的映射。后端的字典列表---> filterItems字段。返回的key和item的field不一致需要传入对应映射
   */
  fieldMap: {[key: string]: string | string[]; };

  /**
   * 表格配置
   */
  gridModel: MainSubStructureModel;
}

export class Programme {
  constructor(options: Partial<ProgrammeParams> = {}) {
    validParams(options);
    const initFilterItems = () => {
      this.filterItems = new FilterItems({
        filterItems: (options.filterItems || []).map((item) => ({
          ...item,
          onPressEnter: this.handleSearch,
        })),
        dict: options.dict,
      });
    };

    const initProgramme = () => {
      this.moduleName = options.moduleName;
      this.collapsed = window.localStorage.getItem(`${filterItemsCollapsePrefix}${this.moduleName}`) === 'true';
      this.getProgrammeList(options.dictList, options.itemList, options.fieldMap);
      this.getDefaultSetting();
    };

    const initGridModel = () => {
      this.gridModel = options.gridModel;
      this.gridModel.getFilterParams = this.getParams;
    };
    initFilterItems();
    initProgramme();
    initGridModel();
  }

  @action private getParams = () => {
    return this.filterItems.params;
  };

  /**
   * 主表model
   */
  public gridModel: MainSubStructureModel;

  /**
   * 查询方案标识。必须传入、否则报错
   */
  public moduleName: string;

  @action private getProgrammeList = (dictList = '', itemList = '', fieldMap = {}) => {
    request<FilterConfigData>({
      url: '/api/filterSet2/getConfig2',
      params: {
        module: this.moduleName,
        dictList,
        itemList,
      },
    })
      .then((info) => {
        this.programmeList = defaultProgramme.concat(info.data.old_set || []);
        const list = formatFilterConfigData(info, fieldMap);
        this.filterItems.addDict(list.reduce((prev, current) => ({
          ...prev,
          [current.field]: current.data,
        }), {}));
        this.filterItems.updateFilterItem(list);
      });
  };

  /**
   * @internal
   */
  @observable public showProgramme = false;

  /**
   * @internal
   */
  @action public handleShowProgramme = (showProgramme: boolean) => {
    this.showProgramme = showProgramme;
  };

  /**
   * @internal
   */
  @action public createProgramme = (params: { scheme_name: string; }): Promise<unknown> => {
    const schemeValue = this.filterItems.actualData.filter((item) => !item.isDynamic)
      .reduce((prev, current) => ({
        ...prev,
        [current.field]: current.toProgramme(),
      }), {});
    return request({
      url: `/api/filterSet2/save/${this.moduleName}`,
      method: 'post',
      data: {
        display_setting: JSON.stringify({}),
        scheme_value: JSON.stringify(schemeValue),
        ...params,
      },
    })
      .then(() => {
        message.success('创建成功');
        this.handleShowProgramme(false);
        this.getProgrammeList();
      });
  };

  /**
   * @internal
   */
  @observable public activeProgramme = defaultProgrammeName;

  /**
   * @internal
   */
  @action public handleItemClick = (item: ProgrammeListItem) => {
    if (this.activeProgramme !== item.scheme_name) {
      this.activeProgramme = item.scheme_name;
      this.filterItems.reset();
      if (item.scheme_value) {
        try {
          const schemeValue = JSON.parse(item.scheme_value) || {};
          this.filterItems.originData.forEach((item) => {
            if (Object.prototype.hasOwnProperty.call(schemeValue, item.field)) {
              item.formatValue.call(item, schemeValue[item.field]);
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
      this.handleSearch();
    }
  };

  /**
   * @internal
   */
  @action public handleItemDelete = (item: ProgrammeListItem) => {
    Modal.confirm({
      content: '确定删除吗?',
      onOk: () => request({
        url: '/api/filterSet/deleteFilterSet',
        method: 'post',
        data: {
          name: item.scheme_name,
          module: this.moduleName,
        },
      })
        .then(action(() => {
          message.success('删除成功');
          if (this.activeProgramme === item.scheme_name) {
            this.activeProgramme = defaultProgrammeName;
            this.filterItems.reset();
            this.handleSearch();
          }
          this.getProgrammeList();
        })),
    });
  };

  /**
   * @internal
   */
  @observable public programmeList: ProgrammeListItem[] = defaultProgramme;

  /**
   * @internal
   */
  @observable public collapsed: boolean;

  /**
   * @internal
   */
  @action public handleCollapsed = () => {
    this.collapsed = !this.collapsed;
    window.localStorage.setItem(`${filterItemsCollapsePrefix}${this.moduleName}`, String(this.collapsed));
  };

  /**
   * @internal
   */
  @observable public isSearch = false;

  /**
   * @internal
   */
  @action public handleSearch = () => {
    this.isSearch = true;

    this.filterItems.validator()
      .then(() => {
        try {
          return this.gridModel.onQuery();
        } catch (error) {
          console.log('error:筛选组件 handleSearch', error);
          return Promise.reject();
        }
      })
      .finally(() => this.isSearch = false);
  };

  /**
   * @internal
   */
  @observable public showSetting = false;

  /**
   * @internal
   */
  @action public handleShowSetting = (showSetting: boolean) => {
    this.showSetting = showSetting;
  };

  @action private handleSettingChange = (params: FilterItemSettingItem[]) => {
    this.filterItems.updateFilterItem(params);
    params.filter((item) => this.filterItems.originData.find((val) => val.field === item.field))
      .forEach((item, newPositionIndex) => {
        const oldPositionIndex = this.filterItems.originData.findIndex((val) => val.field === item.field);
        if (oldPositionIndex !== -1) {
          this.filterItems.swap(oldPositionIndex, newPositionIndex);
        }
      });
  };

  /**
   * @internal
   */
  @action public getDefaultSetting = () => {
    request<BaseData<string>>({
      url: '/api/dashboard/cache/get',
      params: { cacheKey: `${filterItemsSettingPrefix}${this.moduleName}` },
    })
      .then((info) => {
        try {
          const data: FilterItemSettingItem[] = JSON.parse(info.data);
          if (Array.isArray(data)) {
            this.handleSettingChange(data);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  /**
   * @internal
   */
  @action public handleSettingSave = (params: FilterItemSettingItem[]) => {
    return request({
      url: '/api/dashboard/cache/save',
      method: 'post',
      data: new URLSearchParams(Object.entries({
        cacheKey: `${filterItemsSettingPrefix}${this.moduleName}`,
        cacheValue: JSON.stringify(params.map((item) => {
          const newItem = { ...item };

          // 不保存label
          delete newItem.label;
          return newItem;
        })),
      })),
    })
      .then(() => {
        this.handleShowSetting(false);
        this.handleSettingChange(params);
        this.handleSearch();
      });
  };

  /**
   * 查询项instance
   */
  public filterItems: FilterItems;

  /**
   * @internal
   */
  @computed
  public get originSettingData(): FilterItemSettingItem[] {
    return this.filterItems.originData.map((item) => ({
      field: item.field,
      label: item.label,
      showItem: item.showItem,
      showCollapse: item.showCollapse,
      isCollapse: item.isCollapse,
    }));
  }

  /**
   * @internal
   */
  @computed
  public get actualData(): FilterItem[] {
    return this.filterItems.actualData;
  }

  /**
   * @internal
   */
  public scrollContainerRef = React.createRef<HTMLDivElement>();

  /**
   * 是否显示滚动提示框
   */
  @observable public showScroll = false;

  /**
   * @internal
   */
  @action public handleScroll = () => {
    this.showScroll = true;
  };

  /**
   * @internal
   */
  @action public clickCloseScroll = () => {
    this.showScroll = false;
  };

  /**
   * @internal
   */
  @action public clickPreventCloseScroll = (event) => {
    event.stopPropagation();
    this.showScroll = true;
  };
}

@observer
export class ProgrammeComponent extends React.Component<{ store: Programme; className?: string; style?: React.CSSProperties; }> {
  componentDidMount() {
    document.querySelector(`.${styles.scrollContainer}`)
      ?.addEventListener('click', this.props.store.clickPreventCloseScroll);
    window.addEventListener('click', this.props.store.clickCloseScroll, true);
  }

  componentWillUnmount() {
    document.querySelector(`.${styles.scrollContainer}`)
      ?.removeEventListener('click', this.props.store.clickPreventCloseScroll);
    window.removeEventListener('click', this.props.store.clickCloseScroll);
  }

  render() {
    const {
      className = '',
      style = {},
      store: {
        scrollContainerRef,
        handleScroll,
        collapsed,
        filterItems,
        handleCollapsed,
        gridModel,
      },
    } = this.props;
    return (
      <Provider
        filterItems={filterItems}
        programme={this.props.store}
      >
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
            width="300"
          >
            <div
              className={`${styles.filterContent} ${styles.filterContentBase}`}
              onScroll={handleScroll}
              ref={scrollContainerRef}
            >
              <FilterItemsComponent/>
            </div>
            <FilterItemsScroll/>
            <Footer/>
          </Layout.Sider>
          <Layout.Content>
            <ProgrammeList/>
            <div className={styles.tableWrapper}>
              <MainSubStructure store={gridModel}/>
            </div>
          </Layout.Content>
        </Layout>
      </Provider>
    );
  }
}

@inject('programme')
@observer
class Footer extends React.Component<{ programme?: Programme; }> {
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
    } = this.props.programme;
    return (
      <>
        <div className={styles.footer}>
          <Button onClick={() => handleShowSetting(true)}>
            设置
          </Button>
          <Button onClick={() => handleShowProgramme(true)}>
            方案
          </Button>
          <Button
            className="ghost-bg-btn"
            onClick={reset}
          >
            重置
          </Button>
          <Button
            loading={isSearch}
            onClick={handleSearch}
            type="primary"
          >
            查询
          </Button>
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

@inject('programme')
@observer
class ProgrammeList extends React.Component<{ programme?: Programme; }> {
  render() {
    const {
      programmeList,
      activeProgramme,
      handleItemClick,
      handleItemDelete,
    } = this.props.programme;
    return (
      <div className={styles.programmeList}>
        {
          programmeList.map((item, index) => {
            return (
              <section
                className={classNames({ [styles.active]: item.scheme_name === activeProgramme })}
                key={item.scheme_name}
                onClick={() => handleItemClick(item)}
                style={item.scheme_name === activeProgramme && index !== 0 ? { borderLeftColor: '#e2e2e5' } : {}}
              >
                <Typography.Text
                  ellipsis
                  title={item.scheme_name}
                >
                  {item.scheme_name}
                </Typography.Text>
                {
                  !item.sys_setting ? (
                    <span
                      className={styles.del}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleItemDelete(item);
                      }}
                    >
                      x
                    </span>
                  ) : null
                }
              </section>
            );
          })
        }
        <div className={styles.emptyBorder}/>
      </div>
    );
  }
}

@inject('programme')
@observer
class FilterItemsScroll extends React.Component<{ programme?: Programme; }> {
  render() {
    const {
      showScroll,
      actualData,
      scrollContainerRef,
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
                href={`#${item.field}`}
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

/**
 * @internal
 */
@inject('filterItems')
@observer
class FilterItemsComponent extends React.Component<{ filterItems?: FilterItems; }> {
  render() {
    const { actualData } = this.props.filterItems;
    return (
      <div className={styles.filterItemMainContainer}>
        {actualData.map((item) => {
          return (
            <div
              className={styles.filterItemContainer}
              id={item.field}
              key={item.field}
            >
              {
                (() => {
                  if (item.showCollapse) {
                    return (
                      <Collapse
                        activeKey={String(Number(item.isCollapse))}
                        expandIconPosition="right"
                        ghost
                        onChange={() => item.toggleCollapse()}
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
                          key="0"
                        >
                          {filterComponentFactory(item)}
                        </Collapse.Panel>
                      </Collapse>
                    );
                  } else {
                    return (
                      <>
                        {filterComponentFactory(item)}
                      </>
                    );
                  }
                })()
              }
            </div>
          );
        })}
      </div>
    );
  }
}
