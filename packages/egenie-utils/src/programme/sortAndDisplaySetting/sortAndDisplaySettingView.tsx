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
  frozenLastIndex,
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
      if (dragIndex === index || dragIndex <= frozenLastIndex) {
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
    this.store = new SortAndDisplaySettingModel({
      originData: props.originData,
      initSettingData: props.initSettingData,
      callback: props.callback,
      renderLabel: props.renderLabel,
    });
  }

  public store: SortAndDisplaySettingModel;

  render() {
    const {
      onCancel,
      title,
      description,
    } = this.props;
    const {
      columns,
      dataSource,
      isSave,
      handleSave,
      moveRow,
      handleInit,
      frozenLastIndex,
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
          title={title}
          visible
          width={480}
        >
          <section className={styles.descriptionContainer}>
            <i className="icon-note_zs"/>
            {description}
          </section>
          <Table

            // @ts-ignore
            columns={columns}
            components={{
              body: {
                row: (props) => (
                  <DragableBodyRow
                    {...props}
                    frozenLastIndex={frozenLastIndex}
                  />
                ),
              },
            }}
            dataSource={toJS(dataSource)}

            // @ts-ignore
            onRow={(record, index) => ({
              index,
              moveRow,
            })}
            pagination={false}
            rowKey="primaryKey"
            showHeader={false}
            size="small"
          />
        </Drawer>
      </DragAndDropHOC>
    );
  }
}

