import { Button, Col, Row, Space } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import { filterComponentFactory } from './filterComponentFactory';
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
      collapseData,
    } = store;

    console.log(collapseData.length, 'collapseData');
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
export class ButtonContainer extends React.Component<{ store: NormalProgramme; }> {
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
      },
    } = this.props;
    return showButton ? (
      <Col
        className={styles.btn}
        style={{ width: `${(notCollapseActualBtnCount / count) * 100}%` }}
      >
        {
          button ? button : (
            <Space>
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
          )
        }
      </Col>
    ) : null;
  }
}

