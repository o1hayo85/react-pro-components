import { Button, Input, message, Modal, Row, Select, Table } from 'antd';
import { action, computed, observable, toJS } from 'mobx';
import { Observer, observer } from 'mobx-react';
import React from 'react';
import { destroyModal, renderModal } from '../renderModal';
import { request } from '../request';
import { printHelper } from './printHelper';
import type { TemplateData } from './types';
import { getTemplateData } from './utils';

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

class CustomPrintModel {
  constructor(tempType = '', customUrl = '', customParams: {[key: string]: any; } = {}) {
    this.tempType = tempType;
    this.customUrl = customUrl;
    this.customParams = customParams;
    this.getPrinters();
    this.handleQuery();
  }

  private customUrl = '';

  private customParams: {[key: string]: any; } = {};

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

  @observable public dataSource: TemplateData[] = [];

  @observable public loading = false;

  @observable public rowSelection: { selectedRowKeys: number[]; onChange: (selectedRowKeys: number[]) => void; type: string; fixed: boolean; } = {
    selectedRowKeys: [],
    onChange: (selectedRowKeys: number[]) => {
      console.log(selectedRowKeys);
      this.rowSelection.selectedRowKeys = selectedRowKeys || [];
    },
    type: 'radio',
    fixed: true,
  };

  @computed
  public get selectedRows(): TemplateData | null {
    if (this.rowSelection.selectedRowKeys.length) {
      return this.dataSource.find((item) => item.id === this.rowSelection.selectedRowKeys[0]);
    } else {
      return null;
    }
  }

  @action public handleRowClick = (item: TemplateData): void => {
    // 点击自身且原来已经设置
    if (this.rowSelection.selectedRowKeys.length > 0 && item.id === this.selectedRows[0]) {
      this.rowSelection.selectedRowKeys = [];
    } else {
      // @ts-ignore
      this.rowSelection.selectedRowKeys = [item.id];
    }
  };

  public columns = [
    {
      ellipsis: true,
      dataIndex: 'mysqlno',
      title: '模版编号',
      width: 200,
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
      render: (text: string, row: TemplateData) => {
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
    if (this.customUrl) {
      request<{ data: { list: TemplateData[]; }; }>({
        method: 'post',
        url: this.customUrl,
        data: {
          sidx: '',
          sord: 'asc',
          page: 1,
          pageSize: 10000,
          tempName: this.tempName,
          tempType: this.tempType,
          ...this.customParams,
        },
      })
        .then((info) => this.dataSource = info?.data?.list || [])
        .finally(() => this.loading = false);
    } else {
      request<{ list: TemplateData[]; }>({
        method: 'post',
        url: '/api/print/querybyctgr',
        data: new URLSearchParams(Object.entries({
          sidx: '',
          sord: 'asc',
          page: '1',
          pageSize: '10000',
          tempName: this.tempName,
          tempType: this.tempType,
        })),
      })
        .then((info) => this.dataSource = info?.list || [])
        .finally(() => this.loading = false);
    }
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
   * 自定义的url的参数
   */
  customParams?: {[key: string]: any; };

  /**
   * 自定义的url
   */
  customUrl?: string;

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
    this.store = new CustomPrintModel(props.tempType, props.customUrl, props.customParams);
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
      handleRowClick,
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
            onRow={(record) => ({ onClick: () => handleRowClick(record) })}
            pagination={false}
            rowKey="id"

            // @ts-ignore
            rowSelection={toJS(rowSelection)}
            scroll={{ y: 300 }}
            size="small"
          />
        </div>
      </Modal>
    );
  }
}

export async function getCustomPrintParam(tempType: string, customUrl = '', customParams: {[key: string]: any; } = {}): Promise<CustomPrintParam> {
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
        customParams={customParams}
        customUrl={customUrl}
        handleCancel={handleCancel}
        tempType={tempType}
      />
    );
  });
}

export async function getCustomPrintParamByDefaultTemplate(tempType: string): Promise<CustomPrintParam> {
  const info = await request<{ list: TemplateData[]; }>({
    method: 'post',
    url: '/api/print/querybyctgr',
    data: new URLSearchParams(Object.entries({
      sidx: '',
      sord: 'asc',
      page: '1',
      pageSize: '10000',
      tempName: '',
      tempType,
    })),
  });

  const defaultTemplateItem = (info.list || []).map((item) => getTemplateData(item))
    .find((item) => item.defalt);
  if (defaultTemplateItem) {
    return {
      preview: false,
      tempType,
      printer: defaultTemplateItem.printerName,
      templateId: defaultTemplateItem.id,
    };
  } else {
    return getCustomPrintParam(tempType);
  }
}
