import { message, Modal } from 'antd';
import { request } from '../request';
import { getCustomPrintParam } from './customPrint';
import { printHelper } from './printHelper';
import type { BasePrintParams, TemplateData } from './types';
import { ENUM_PRINT_PLUGIN_TYPE, ENUM_SHOP_TYPE } from './types';
import { validateData } from './utils';

interface PrintData {
  cpCode?: string;
  type?: ENUM_SHOP_TYPE;
  newPrint?: boolean;
  courierPrintType?: number;
  waybillData?: {
    tempData?: TemplateData;
    notHaveCourierNo?: string;
    havePrintList?: string;
    userData?: any[];
    updateIds?: string;
    docIds?: string;
  };
}

/**
 * 重要参数preview、userDataIds、tempType、printSrc
 */
interface PrintWayBillParams {

  /**
   * 模版类型
   * '0': '快递单',
   * '1': '发货单',
   * '2': '捡货单',
   * '4': '商品信息',
   * '6': '水洗唛',
   * '7': '合格证',
   * '10': '分拣车',
   * '17': '出入库单',
   * '19': '调拨单',
   * '21': '收货单',
   * '27': '唯一码',
   */
  tempType?: string | number;

  /**
   * 是否预览
   */
  preview?: boolean;

  /**
   * 打印机
   */
  printer?: string;

  /**
   * 模版id
   */
  templateId?: number | string;

  /**
   * 待打印发货单ID
   */
  userDataIds?: string;

  /**
   * 打印来源
   *  PRINT_0(0, "未知来源打印"),
   *  PRINT_1(1, "前置打印"),
   *  PRINT_2(2, "分拣打印"),
   *  PRINT_3(3, "分拣补打"),
   *  PRINT_4(4, "收尾打印"),
   *  PRINT_5(5, "波次管理打印"),
   *  PRINT_6(6, "配齐墙单个打印"),
   *  PRINT_7(7, "配齐墙批量打印"),
   *  PRINT_8(8, "打包发货补打打印"),
   *  PRINT_9(9, "PDA分拣配齐后打印"),
   *  PRINT_10(10, "强制拆单打印"),
   *  PRINT_11(11, "分拣打印"),
   *  PRINT_12(12, "多包裹打印"),
   *  PRINT_13(13, "快速分拣打印"),
   *  PRINT_14(14, "快速分拣补打打印"),
   *  PRINT_15(15, "快速分拣配齐墙单个打印"),
   *  PRINT_16(16, "快速分拣配齐墙批量打印"),
   *  PRINT_17(17, "批量分拣打印"),
   *  PRINT_18(18, "确认退货打印"),
   *  PRINT_19(19, "分拣重打");
   */
  printSrc?: string | number;

  /**
   * 一次打印数量(默认500)
   */
  count?: number;

  /**
   * 排序策略
   */
  orderBy?: string;

  /**
   * 是否校验已打印状态(已打印、在波次内的不能打印)
   */
  checkPrint?: boolean;

  /**
   * 是否更新打印状态(暂时传false状态更新功能另作处理)
   */
  updateStatus?: boolean;

  /**
   * 是否未配齐墙(无用字段)
   */
  sortingWall?: boolean;

  /**
   * 是否清配齐格子(暂不支持传 false)
   */
  clearCell?: boolean;

  /**
   * 快递单号(多包裹获取的新单号)
   */
  courierNo?: string;

  /**
   * 更新回掉的参数
   */
  checkSku?: boolean;

  [key: string]: any;
}

class PrintWayBill {
  /**
   * 前置打印
   */
  public readonly frontPrint = async(params: PrintWayBillParams): Promise<void> => {
    await new Promise((resolve, reject) => {
      Modal.confirm({
        content: params.preview ? '确定预览' : '确定打印',
        onOk: () => resolve(true),
        onCancel: () => reject(),
      });
    });

    await this.getDataAndPrint({
      printSrc: '1',
      checkPrint: true,
      ...params,
    });
  };

  /**
   * 自定义打印
   */
  public readonly customPrint = async(params: PrintWayBillParams): Promise<void> => {
    const customParams = await getCustomPrintParam('0');

    await this.getDataAndPrint({
      ...params,
      ...customParams,
    });
  };

  /**
   * 获取数据并且打印
   */
  public readonly getDataAndPrint = async(params: PrintWayBillParams): Promise<void> => {
    const newParams = {
      checkPrint: false,
      clearCell: false,
      sortingWall: false,
      orderBy: 'sku_no',
      ...params,
    };

    const printData = await request<{ data: PrintData[]; }>({
      url: '/api/print/wms/waybill/queryWaybillPrintData',
      data: newParams,
      method: 'post',
    });

    validateData(printData.data);
    await this.executePrint(newParams, printData.data);
  };

  /**
   * 有数据,直接打印
   */
  public readonly executePrint = async(params: PrintWayBillParams, printData: PrintData[]): Promise<void> => {
    validateData(printData);

    for (let i = 0; i < printData.length; i++) {
      const waybillData = printData[i].waybillData;
      const tempData = waybillData.tempData;
      const userData = waybillData.userData;
      const waybillType = printData[i].type;
      const newPrint = printData[i].newPrint;
      const courierPrintType = printData[i].courierPrintType;
      const cpCode = printData[i].cpCode;

      const callbackData = {
        callbackIds: waybillData.updateIds,
        checkSku: params.checkSku,
        printSrc: params.printSrc,
        docIds: waybillData.docIds,
      };

      const commonPrintData: BasePrintParams = {
        printer: params.printer,
        preview: params.preview,
        count: params.count,
        contents: userData,
        templateData: tempData,
      };

      if (await this.handleNotify(waybillData)) {
        switch (waybillType) {
          case ENUM_SHOP_TYPE.jd:
            if (newPrint) {
              await printHelper.print({
                ...commonPrintData,
                state: ENUM_PRINT_PLUGIN_TYPE.jdNew,
              });
            } else {
              await printHelper.print({
                ...commonPrintData,
                state: ENUM_PRINT_PLUGIN_TYPE.jdOld,
              });
            }
            break;
          case ENUM_SHOP_TYPE.pdd:
            if (newPrint) {
              await printHelper.print({
                ...commonPrintData,
                state: ENUM_PRINT_PLUGIN_TYPE.pddNew,
              });
            } else {
              await printHelper.print({
                ...commonPrintData,
                state: ENUM_PRINT_PLUGIN_TYPE.pddOld,
                courierPrintType,
              });
            }
            break;
          case ENUM_SHOP_TYPE.rookie:
            if (newPrint) {
              await printHelper.print({
                ...commonPrintData,
                state: ENUM_PRINT_PLUGIN_TYPE.rookieNew,
              });
            } else {
              await printHelper.print({
                ...commonPrintData,
                state: ENUM_PRINT_PLUGIN_TYPE.rookieOld,
              });
            }
            break;
          case ENUM_SHOP_TYPE.dy:
            if (newPrint) {
              await printHelper.print({
                ...commonPrintData,
                state: ENUM_PRINT_PLUGIN_TYPE.dyNew,
              });
            } else {
              await printHelper.print({
                ...commonPrintData,
                state: ENUM_PRINT_PLUGIN_TYPE.dyOld,
              });
            }
            break;
          case ENUM_SHOP_TYPE.ks:
            if (newPrint) {
              await printHelper.print({
                ...commonPrintData,
                state: ENUM_PRINT_PLUGIN_TYPE.ksNew,
              });
            } else {
              await printHelper.print({
                ...commonPrintData,
                state: ENUM_PRINT_PLUGIN_TYPE.ksOld,
                cpCode,
              });
            }
            break;
          default: {
            const error = `面单渠道类型:${waybillType}不存在`;
            message.error({
              key: error,
              content: error,
            });
            throw new Error(error);
          }
        }
        await this.updateStatus(callbackData);
      }
    }
  };

  private handleNotify = async(waybillData: PrintData['waybillData']): Promise<boolean> => {
    const notHaveCourierNo = waybillData.notHaveCourierNo;
    const havePrintList = waybillData.havePrintList;
    let step1 = true;
    let step2 = true;

    if (notHaveCourierNo) {
      step1 = await new Promise((resolve) => {
        Modal.confirm({
          title: '以下发货单没有获取到快递单号，打印时候将被跳过，确定继续打印',
          content: `${notHaveCourierNo}`,
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });
    }

    if (havePrintList) {
      step2 = await new Promise((resolve) => {
        Modal.confirm({
          title: '以下单号已经打印过：「确定」继续打印，「取消」重新选择',
          content: `${havePrintList}`,
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });
    }

    return step1 && step2;
  };

  private updateStatus = (data: {
    callbackIds: string | number;
    checkSku: boolean;
    printSrc: string | number;
    docIds: string;
  }): Promise<any> => {
    return request({
      url: '/api/print/wms/waybill/updateWaybillPrintCallback',
      method: 'post',
      data,
    });
  };
}

export const printWayBill = new PrintWayBill();
