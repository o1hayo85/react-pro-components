import { Button, Col, Modal, Row, Space, Table } from 'antd';
import { action, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DragAndDropHOC } from '../dragAndDropHOC';
import styles from './programme.less';
import type { FilterItemSettingItem } from './types';

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

interface FilterItemSettingModalProps {
  // eslint-disable-next-line @typescript-eslint/ban-types
  onCancel: Function;
  originData: FilterItemSettingItem[];
  initSettingData: FilterItemSettingItem[];
  callback: (params: FilterItemSettingItem[]) => Promise<unknown>;
}

export class FilterItemSetting {
  constructor(originData: FilterItemSettingItem[], initSettingData: FilterItemSettingItem[], callback: FilterItemSettingModalProps['callback']) {
    this.originData = JSON.parse(JSON.stringify(originData));
    this.initSettingData = JSON.parse(JSON.stringify(initSettingData));
    this.callback = callback;
    this.handleReset();
  }

  private callback: FilterItemSettingModalProps['callback'];

  @observable public selectedRowKeys: string[] = [];

  @action public onChange = (selectedRowKeys: string[]): void => {
    this.selectedRowKeys = selectedRowKeys;
  };

  public originData: FilterItemSettingItem[] = [];

  public initSettingData: FilterItemSettingItem[] = [];

  @observable public dataSource: FilterItemSettingItem[] = [];

  @action public handleReset = () => {
    this.dataSource = JSON.parse(JSON.stringify(this.originData));
    this.selectedRowKeys = this.originData.filter((item) => item.showItem)
      .map((item) => item.field);
  };

  @action public handleInit = () => {
    this.dataSource = JSON.parse(JSON.stringify(this.initSettingData));
    this.selectedRowKeys = this.initSettingData.filter((item) => item.showItem)
      .map((item) => item.field);
  };

  @observable public isSave = false;

  @action public handleSave = () => {
    this.isSave = true;
    const data = this.dataSource.map((item) => toJS(item))
      .map((item) => ({
        ...item,
        showItem: this.selectedRowKeys.includes(item.field),
      }));
    this.callback(data)
      .finally(() => this.isSave = false);
  };

  @action public moveRow = (dragIndex: number, hoverIndex: number) => {
    const tmp = this.dataSource[dragIndex];
    this.dataSource.splice(dragIndex, 1);
    this.dataSource.splice(hoverIndex, 0, tmp);
  };

  public get columns() {
    return [
      {
        title: '名称',
        dataIndex: 'label',
        key: 'label',
        width: 200,
        ellipsis: true,
      },
    ];
  }
}

@observer
export class FilterItemSettingModal extends React.Component<FilterItemSettingModalProps> {
  constructor(props: FilterItemSettingModalProps) {
    super(props);
    this.store = new FilterItemSetting(props.originData, props.initSettingData, props.callback);
  }

  public store: FilterItemSetting;

  render() {
    const { onCancel } = this.props;
    const {
      columns,
      dataSource,
      selectedRowKeys,
      onChange,
      isSave,
      handleSave,
      moveRow,
      handleInit,
    } = this.store;
    return (
      <DragAndDropHOC>
        <Modal
          centered
          className={styles.filterItemSetting}
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
                  <Button onClick={() => onCancel()}>
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
          onCancel={() => onCancel()}
          title="查询项设置"
          visible
          width={500}
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
            rowKey="field"
            rowSelection={{
              selectedRowKeys,
              onChange,
            }}
            scroll={{
              y: 440,
              x: 0,
            }}
            size="small"
            style={{ height: 480 }}
          />
        </Modal>
      </DragAndDropHOC>
    );
  }
}

