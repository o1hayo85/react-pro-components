import { Button, Col, Row, Space } from 'antd';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { filterComponentFactory, FilterItems, FilterItemsParams } from './filterItems';
import styles from './normalProgramme.less';

export interface NormalProgrammeParams extends FilterItemsParams {

  /**
   * 回车回掉。自定义也需要传
   */
  handleSearch?: (...args: any) => Promise<any>;

  /**
   * 一行显示个数
   */
  count?: number;

  /**
   * 自定义的button。会覆盖默认的重置、查询
   */
  button?: React.ReactNode;

  /**
   * 是否显示button
   */
  showButton?: boolean;
}

export class NormalProgramme {
  constructor(options: Partial<NormalProgrammeParams> = {}) {
    const initFilterItems = () => {
      this.filterItems = new FilterItems({
        filterItems: (options.filterItems || []).map((item) => ({
          ...item,
          onPressEnter: this.handleSearch,
        })),
        dict: options.dict,
      });

      this.searchCallback = options.handleSearch;

      if (options.count) {
        this.count = options.count;
      }

      if (options.button) {
        this.button = options.button;
      }

      if (options.showButton != null) {
        this.showButton = options.showButton;
      }
    };

    initFilterItems();
  }

  private searchCallback: NormalProgrammeParams['handleSearch'];

  /**
   * @internal
   */
  @observable public isSearch = false;

  /**
   * @internal
   */
  @action public handleSearch = () => {
    if (typeof this.searchCallback === 'function') {
      try {
        this.isSearch = true;
        this.searchCallback()
          .finally(() => this.isSearch = false);
      } catch (error) {
        this.isSearch = false;
        console.log('error:筛选组件 handleSearch', error);
      }
    }
  };

  /**
   * 查询项instance
   */
  public filterItems: FilterItems;

  @observable public count = 4;

  /**
   * 自定义的button。会覆盖默认的重置、查询
   */
  public button: NormalProgrammeParams['button'] = null;

  @observable public showButton = true;

  /**
   * @internal
   */
  @action public reset = () => {
    this.filterItems.originData.forEach((item) => item.reset());
  };
}

@observer
export class NormalProgrammeComponent extends React.Component<{ store: NormalProgramme; className?: string; style?: React.CSSProperties; }> {
  render() {
    const {
      className = '',
      style = {},
      store: {
        filterItems: { actualData },
        count,
        button,
        reset,
        isSearch,
        handleSearch,
        showButton,
      },
    } = this.props;
    const colWidth = 100 / count;
    const patchCount = count >= 6 && Boolean(actualData.find((item) => (item.type === 'date' || item.type === 'dateRange') && item.format === 'YYYY-MM-DD HH:mm:ss')) ? 1 : 0;
    const btnWidth = ((count - ((actualData.length + patchCount) % count)) / count) * 100;
    return (
      <div
        className={`${styles.content} ${styles.contentBase} ${className}`}
        style={style}
      >
        <Row
          gutter={[
            8,
            8,
          ]}
        >
          {actualData.map((item) => {
            let newWidth;
            if ((item.type === 'date' || item.type === 'dateRange') && item.format === 'YYYY-MM-DD HH:mm:ss' && count >= 6) {
              newWidth = colWidth * 2;
            } else {
              newWidth = colWidth;
            }

            return (
              <Col
                key={item.field}
                style={{ width: `${newWidth}%` }}
              >
                {filterComponentFactory(item)}
              </Col>
            );
          })}
          {
            showButton ? (
              <Col
                className={styles.btn}
                style={{ width: `${btnWidth}%` }}
              >
                {
                  button ? button : (
                    <Space>
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
                    </Space>
                  )
                }
              </Col>
            ) : null
          }
        </Row>
      </div>
    );
  }
}

