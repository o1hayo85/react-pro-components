import { Button, Input, message, Modal, Row, Select } from 'antd';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { MainSubStructure, MainSubStructureModel } from '../egGrid';
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

class CustomPrintModel {
  constructor(tempType = '') {
    this.tempType = tempType;
    this.getPrinters();
    this.gridModel.onQuery();
  }

  private tempType = '';

  @observable public printers: string[] = [];

  @observable public tempName = '';

  @action public getPrinters = () => {
    printHelper.getPrinters()
      .then((printers) => this.printers = printers);
  };

  @action public handleChangeTempName = (event) => {
    this.tempName = event.target.value;
  };

  @action public handleSearchTempName = (value) => {
    this.tempName = value || '';
    this.gridModel.onQuery();
  };

  public gridModel = new MainSubStructureModel({
    grid: {
      columns: [
        {
          key: 'mysqlno',
          name: '模版编号',
          width: 200,
          formatter: observer(({ row }) => {
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
          }),
        },
        {
          key: 'tempName',
          name: '模板名称',
          width: 200,
        },
        {
          key: 'tempType',
          name: '模版类型',
          width: 200,
          formatter: ({ row }) => {
            return (
              <div>
                {tempTypeList[row.tempType]}
              </div>
            );
          },
        },
        {
          key: 'courier',
          name: '快递公司',
          width: 100,
        },
        {
          key: 'printerName',
          name: '打印机名称',
          width: 200,
          formatter: observer(({ rowIdx }) => {
            return (
              <Select
                onChange={(value) => this.gridModel.gridModel.rows[rowIdx].printerName = value}
                onClick={(e) => e.stopPropagation()}
                options={this.printers.map((item) => ({
                  value: item,
                  label: item,
                }))}
                placeholder="请选择"
                style={{ width: '100%' }}
                value={this.gridModel.gridModel.rows[rowIdx]?.printerName}
              />
            );
          }),
        },
        {
          key: 'pageWidth',
          name: '纸张宽',
          width: 100,

        },
        {
          key: 'pageHeight',
          name: '纸张高',
          width: 100,

        },
        {
          key: 'rowCount',
          name: '行',
          width: 100,

        },
        {
          key: 'colsCount',
          name: '列',
          width: 100,

        },
        {
          key: 'updateTime',
          name: '更新时间',
          width: 200,

        },
      ],
      rows: [],
      primaryKeyField: 'id',
      pageSize: 20,
      showPager: true,
      showEmpty: true,
      showCheckBox: true,
      sortByLocal: false,
    },
    hiddenSubTable: true,
    api: {
      onQuery: (params) => {
        const {
          filterParams = {},
          ...rest
        } = params;

        return request<any>({
          method: 'post',
          url: '/api/print/querybyctgr',
          data: new URLSearchParams(Object.entries({
            ...rest,
            sidx: '',
            sord: 'asc',
            tempName: this.tempName,
            tempType: this.tempType,
          })),
        })
          .then((info) => ({ data: info }));
      },
    },
  });
}

/**
 * Modal的props。外层自己控制显示和隐藏
 */
export interface CustomPrintModalProps {

  /**
   * 打印或者预览callback
   * @param params
   */
  callback?: (params: { preview?: boolean; tempType?: string | number; templateId?: number | string; printer?: string; }) => void;

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
  constructor(props) {
    super(props);
    this.store = new CustomPrintModel(props.tempType);
  }

  private handlePrint = (preview: boolean) => {
    const rows = this.store.gridModel.gridModel.selectRows;
    if (rows.length !== 1) {
      message.error('请选择一条打印模板');
      return;
    }

    if (!rows[0].printerName) {
      message.error('请选择打印机');
      return;
    }

    if (typeof this.props.callback === 'function') {
      this.props.callback({
        preview,
        tempType: rows[0].tempType,
        templateId: rows[0].mysqlid,
        printer: rows[0].printerName,
      });
    }
  };

  public store: CustomPrintModel;

  render() {
    const {
      gridModel,
      tempName,
      handleChangeTempName,
      handleSearchTempName,
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
          <div style={{ height: 300 }}>
            <MainSubStructure store={gridModel}/>
          </div>
        </div>
      </Modal>
    );
  }
}

