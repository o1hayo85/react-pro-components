import { Button, Col, Popover, Row, Space, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import { RenderByCondition } from '../../renderByCondition';
import { filterComponentFactory } from '../filterComponentFactory';
import type { NormalProgramme } from './normalProgramme';
import styles from './normalProgramme.less';

interface NormalProgrammeComponentProps {
  store: NormalProgramme;
  className?: string;
  style?: React.CSSProperties;
}

@observer
export class NormalProgrammeComponent extends React.Component<NormalProgrammeComponentProps> {
  render() {
    const {
      className = '',
      style = {},
      store,
    } = this.props;
    const {
      count,
      notCollapseData,
    } = store;

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
          {
            notCollapseData.map((item) => (
              <Col
                key={item.filterItem.field}
                style={{ width: `${(item.itemCount / count) * 100}%` }}
              >
                {filterComponentFactory(item.filterItem)}
              </Col>
            ))
          }
          <ButtonContainer store={store}/>
        </Row>
      </div>
    );
  }
}

@observer
class ButtonContainer extends React.Component<{ store: NormalProgramme; }> {
  render() {
    const {
      store: {
        count,
        button,
        reset,
        isSearch,
        handleSearch,
        showButton,
        notCollapseActualBtnCount,
        collapseData,
      },
    } = this.props;
    return (
      <RenderByCondition show={showButton}>
        <Col
          className={styles.btn}
          style={{ width: `${(notCollapseActualBtnCount / count) * 100}%` }}
        >
          <RenderByCondition show={!button}>
            <Space size={4}>
              <RenderByCondition show={collapseData.length > 0}>
                <Popover
                  arrowPointAtCenter
                  content={(
                    <Row
                      className={styles.collapseContainer}
                      gutter={[
                        8,
                        8,
                      ]}
                    >
                      {
                        collapseData.map((item) => (
                          <Col
                            key={item.filterItem.field}
                            style={{ width: '50%' }}
                          >
                            {filterComponentFactory(item.filterItem)}
                          </Col>
                        ))
                      }
                    </Row>
                  )}
                  overlayInnerStyle={{ width: 752 }}
                  placement="bottomRight"
                  title={null}
                  trigger="click"
                >
                  <Button
                    style={{
                      paddingLeft: 4,
                      paddingRight: 4,
                    }}
                    type="text"
                  >
                    更多&nbsp;
                    <i className="icon-arrow_pulldown"/>
                  </Button>
                </Popover>
              </RenderByCondition>

              <Button
                onClick={reset}
                style={{
                  paddingLeft: 8,
                  paddingRight: 8,
                }}
              >
                重置
              </Button>
              <Button
                loading={isSearch}
                onClick={handleSearch}
                style={{
                  paddingLeft: 8,
                  paddingRight: 8,
                }}
                type="primary"
              >
                查询
              </Button>
              <RenderByCondition show={false}>
                <Tooltip
                  arrowPointAtCenter
                  placement="bottomRight"
                  title="查询项设置"
                >
                  <Button
                    style={{
                      paddingLeft: 4,
                      paddingRight: 4,
                    }}
                    type="text"
                  >
                    <i
                      className="icon-sz01"
                      style={{ fontSize: 14 }}
                    />
                  </Button>
                </Tooltip>
              </RenderByCondition>
            </Space>
          </RenderByCondition>
        </Col>
      </RenderByCondition>
    );
  }
}

