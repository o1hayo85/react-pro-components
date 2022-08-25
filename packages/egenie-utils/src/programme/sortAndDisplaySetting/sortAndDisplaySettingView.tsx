import { Button, Col, Row, Space, Table, Drawer } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DragAndDropHOC } from '../../dragAndDropHOC';
import styles from './sortAndDisplaySetting.less';
import { SortAndDisplaySettingModel } from './sortAndDisplaySettingModel';
import type { SortAndDisplaySettingViewProps } from './types';

const DragableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}) => {
  const ref = React.useRef();
  const [
    {
      isOver,
      dropClassName,
    },
    drop,
  ] = useDrop({
    accept: 'DragableBodyRow',
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ` ${styles.dropOverDownward}` : ` ${styles.dropOverUpward}`,
      };
    },
    drop: (item) => {
      // @ts-ignore
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    item: {
      type: 'DragableBodyRow',
      index,
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  drop(drag(ref));
  return (
    <tr
      className={`${className}${isOver ? dropClassName : ''}`}
      ref={ref}
      style={{
        cursor: 'move',
        ...style,
      }}
      {...restProps}
    />
  );
};

@observer
export class SortAndDisplaySettingView extends React.Component<SortAndDisplaySettingViewProps> {
  constructor(props: SortAndDisplaySettingViewProps) {
    super(props);
    this.store = new SortAndDisplaySettingModel(props.originData, props.initSettingData, props.callback);
  }

  public store: SortAndDisplaySettingModel;

  render() {
    const { onCancel } = this.props;
    const {
      columns,
      dataSource,
      selectedRowKeys,
      handleSelectedRowKeysChange,
      isSave,
      handleSave,
      moveRow,
      handleInit,
    } = this.store;
    return (
      <DragAndDropHOC>
        <Drawer
          className={styles.sortAndDisplaySetting}
          footer={(
            <Row justify="space-between">
              <Col>
                <Space>
                  <Button
                    className="ghost-bg-btn"
                    onClick={handleInit}
                  >
                    恢复默认
                  </Button>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Button onClick={onCancel}>
                    取消
                  </Button>
                  <Button
                    loading={isSave}
                    onClick={handleSave}
                    type="primary"
                  >
                    保存
                  </Button>
                </Space>
              </Col>
            </Row>
          )}
          maskClosable={false}
          onClose={onCancel}
          title="查询项设置"
          visible
          width={480}
        >
          <Table
            columns={columns}
            components={{ body: { row: DragableBodyRow }}}
            dataSource={toJS(dataSource)}

            // @ts-ignore
            onRow={(record, index) => ({
              index,
              moveRow,
            })}
            pagination={false}
            rowKey="primaryKey"
            rowSelection={{
              selectedRowKeys,
              onChange: handleSelectedRowKeysChange,
            }}
            size="small"
            style={{ height: '100%' }}
          />
        </Drawer>
      </DragAndDropHOC>
    );
  }
}

