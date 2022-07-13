import { Button, Col, Row, Space } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import { filterComponentFactory } from './filterComponentFactory';
import { FormatDateType } from './filterDate';
import type { NormalProgramme } from './normalProgramme';
import styles from './normalProgramme.less';
import { ENUM_FILTER_ITEM_TYPE } from './types';

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
    const patchCount = actualData.reduce((prev, item) => {
      if (item.type === ENUM_FILTER_ITEM_TYPE.date || item.type === ENUM_FILTER_ITEM_TYPE.dateRange) {
        if (item.format === FormatDateType.defaultFormat) {
          if (count >= 6) {
            return prev + 1;
          }
        }
      }
      return prev;
    }, 0);
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
            let newWidth = colWidth;
            if (item.type === ENUM_FILTER_ITEM_TYPE.date || item.type === ENUM_FILTER_ITEM_TYPE.dateRange) {
              if (item.format === FormatDateType.defaultFormat) {
                if (count >= 6) {
                  newWidth = colWidth * 2;
                }
              }
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
            ) : null
          }
        </Row>
      </div>
    );
  }
}

