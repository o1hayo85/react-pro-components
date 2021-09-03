import { Button, Input, message, Modal, Row, Select, Table } from 'antd';
import { action, computed, observable } from 'mobx';
import { Observer, observer } from 'mobx-react';
import React from 'react';
import { destroyModal, renderModal } from '../renderModal';
import { request } from '../request';
import { printHelper } from './printHelper';

const tempTypeList = {
  '4': '商品信息',
  '7': '合格证',
  '17': '出入库单',
  '19': '调拨单',
  '0': '快递单',
  '1': '发货单',
  '21': '收货单',
  '27': '打印唯一码',
};

interface Item {
  colsCount?: string;
  ddlfontsize?: number;
  category_no?: string;
  pageHeight?: string;
  bkimgHeight?: string;
  pageWidth?: string;
  inRow?: string;
  tempName?: string;
  cainiaoTempXml?: string;
  id?: number;
  rowCount?: string;
  backgrd?: string;
  moren_fontfamliy?: string;
  courierNo?: string;
  tempType?: string;
  productType?: string;
  logoFlg?: string;
  inCols?: string;
  textAlign?: string;
  defalt?: number;
  mysqlno?: string;
  printerName?: string;
  updateTime?: string;
  version?: number;
  mysqlid?: number;
  LianDan?: string;
  cainiaoTemp?: string;
  vaLign?: string;
  _id?: number;
}

class CustomPrintModel {
  constructor(tempType = '') {
    this.tempType = tempType;
    this.getPrinters();
    this.handleQuery();
  }

  private tempType = '';

  @observable public printers: string[] = [];

  @observable public tempName = '';

  @action public getPrinters = () => {
    printHelper.getPrinters()
      .then((printers) => this.printers = printers);
  };

  @action public handleChangeTempName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.tempName = event.target.value;
  };

  @action public handleSearchTempName = (value: string) => {
    this.tempName = value || '';
    this.handleQuery();
  };

  @observable public dataSource: Item[] = [];

  @observable public loading = false;

  @observable public rowSelection: { selectedRowKeys: number[]; onChange: (selectedRowKeys: number[]) => void; type: string; fixed: boolean; } = {
    selectedRowKeys: [],
    onChange: (selectedRowKeys: number[]) => {
      this.rowSelection.selectedRowKeys = selectedRowKeys || [];
    },
    type: 'radio',
    fixed: true,
  };

  @computed
  public get selectedRows(): Item | null {
    if (this.rowSelection.selectedRowKeys.length) {
      return this.dataSource.find((item) => item.id === this.rowSelection.selectedRowKeys[0]);
    } else {
      return null;
    }
  }

  public columns = [
    {
      ellipsis: true,
      dataIndex: 'mysqlno',
      title: '模版编号',
      width: 200,
      render: (text: string, row: Item) => {
        return (
          <a
            onClick={() => {
              try {
                // @ts-ignore
                window.top.egenie.openTab(`/page/print/printView/index.html?tempType=${row.tempType}&tempShow=${row.mysqlid}&category_no=`, 'printTemp', `编辑[${tempTypeList[row.tempType]}]模板`);
              } catch (e) {
                console.log(e);
              }
            }}
          >
            {row.mysqlno}
          </a>
        );
      },
    },
    {
      ellipsis: true,
      dataIndex: 'tempName',
      title: '模板名称',
      width: 150,
    },
    {
      ellipsis: true,
      dataIndex: 'tempType',
      title: '模版类型',
      width: 120,
      render: (text: string | number) => (tempTypeList[text]),
    },
    {
      ellipsis: true,
      dataIndex: 'courier',
      title: '快递公司',
      width: 120,
    },
    {
      dataIndex: 'printerName',
      title: '打印机名称',
      width: 200,
      render: (text: string, row: Item) => {
        return (
          <Observer>
            {
              () => (
                <Select
                  onChange={(value) => row.printerName = value}
                  onClick={(e) => e.stopPropagation()}
                  options={this.printers.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  placeholder="请选择"
                  size="small"
                  style={{ width: '100%' }}
                  value={row.printerName}
                />
              )
            }
          </Observer>
        );
      },
    },
    {
      dataIndex: 'pageWidth',
      title: '纸张宽',
      width: 90,
    },
    {
      dataIndex: 'pageHeight',
      title: '纸张高',
      width: 90,
    },
    {
      dataIndex: 'rowCount',
      title: '行',
      width: 30,
    },
    {
      dataIndex: 'colsCount',
      title: '列',
      width: 30,
    },
    {
      ellipsis: true,
      dataIndex: 'updateTime',
      title: '更新时间',
      width: 180,
    },
  ];

  @action public handleQuery = () => {
    this.dataSource = [];
    this.rowSelection.selectedRowKeys = [];
    this.loading = true;
    request<{ list: Item[]; }>({
      method: 'post',
      url: '/api/print/querybyctgr',
      data: new URLSearchParams(Object.entries({
        sidx: '',
        sord: 'asc',
        tempName: this.tempName,
        tempType: this.tempType,
      })),
    })
      .then((info) => this.dataSource = info?.list || [])
      .finally(() => this.loading = false);
  };
}

interface CustomPrintParam {

  /**
   * 是否预览
   */
  preview?: boolean;

  /**
   * 模版类型
   */
  tempType?: string | number;

  /**
   * 模版id
   */
  templateId?: number | string;

  /**
   * 打印机
   */
  printer?: string;
}

/**
 * Modal的props。外层自己控制显示和隐藏
 */
interface CustomPrintModalProps {

  /**
   * 打印或者预览callback
   * @param params
   */
  callback?: (params: CustomPrintParam) => void;

  /**
   * 初始化筛选的模版类型
   */
  tempType?: string;

  /**
   * 关闭回掉
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  handleCancel?: Function;
}

@observer
export class CustomPrintModal extends React.Component<CustomPrintModalProps> {
  constructor(props: CustomPrintModalProps) {
    super(props);
    this.store = new CustomPrintModel(props.tempType);
  }

  private handlePrint = (preview: boolean) => {
    const selectedRows = this.store.selectedRows;
    if (!selectedRows) {
      message.error({
        key: '请选择一条打印模板',
        content: '请选择一条打印模板',
      });
      return;
    }

    if (!selectedRows.printerName) {
      message.error({
        key: '请选择打印机',
        content: '请选择打印机',
      });
      return;
    }

    if (typeof this.props.callback === 'function') {
      this.props.callback({
        preview,
        tempType: selectedRows.tempType,
        templateId: selectedRows.mysqlid,
        printer: selectedRows.printerName,
      });
    }
  };

  public store: CustomPrintModel;

  render() {
    const {
      tempName,
      handleChangeTempName,
      handleSearchTempName,
      dataSource,
      columns,
      loading,
      rowSelection,
    } = this.store;
    const { handleCancel } = this.props;
    return (
      <Modal
        footer={(
          <>
            <Button
              danger
              onClick={() => this.handlePrint(true)}
              type="primary"
            >
              打印预览
            </Button>
            <Button
              onClick={() => this.handlePrint(false)}
              type="primary"
            >
              打印
            </Button>
            <Button
              onClick={() => handleCancel?.()}
            >
              取消
            </Button>
          </>
        )}

        maskClosable={false}
        onCancel={() => handleCancel?.()}
        title="打印设置"
        visible
        width={1000}
      >
        <div>
          <Row align="middle">
            <span>
              模板名称：
            </span>
            <Input.Search
              allowClear
              enterButton="搜索"
              onChange={handleChangeTempName}
              onSearch={handleSearchTempName}
              placeholder="请输入模板名称"
              style={{ width: 200 }}
              value={tempName}
            />
          </Row>
          <br/>
          <Table
            bordered={false}
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={false}
            rowKey="id"

            // @ts-ignore
            rowSelection={rowSelection}
            scroll={{ y: 300 }}
            size="small"
          />
        </div>
      </Modal>
    );
  }
}

export async function getCustomPrintParam(tempType: string): Promise<CustomPrintParam> {
  // 防止多次渲染Modal
  await new Promise((resolve, reject) => {
    Modal.confirm({
      content: '确定自定义打印?',
      onOk: () => resolve(true),
      onCancel: () => reject(),
    });
  });

  return new Promise((resolve, reject) => {
    function handleOk(customParams: CustomPrintParam) {
      resolve(customParams);
      destroyModal();
    }

    function handleCancel() {
      reject();
      destroyModal();
    }

    renderModal(
      <CustomPrintModal
        callback={handleOk}
        handleCancel={handleCancel}
        tempType={tempType}
      />
    );
  });
}
