import { message, Modal } from 'antd';
import { request } from '../request';
import { getCustomPrintParam } from './customPrint';
import { printHelper } from './printHelper';
import type { TemplateData } from './types';
import { ENUM_SHOP_TYPE } from './types';
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
   * 排序(暂没有排序策略，不支持，默认可不传)
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
  public readonly frontPrint = async({
    preview,
    ...rest
  }: PrintWayBillParams): Promise<void> => {
    await new Promise((resolve, reject) => {
      Modal.confirm({
        content: preview ? '确定预览' : '确定打印',
        onOk: async() => {
          try {
            await this.getDataAndPrint({
              preview,
              ...rest,
              printSrc: '1',
              checkPrint: true,
            });
            resolve(true);
          } catch (e) {
            reject();
          }
        },
        onCancel: () => reject(),
      });
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
  public readonly getDataAndPrint = async({
    preview,
    printer,
    ...rest
  }: PrintWayBillParams): Promise<void> => {
    const data = {
      checkPrint: false,
      clearCell: false,
      sortingWall: false,
      orderBy: 'sku_no',
      ...rest,
    };

    const printData = await request<{ data: PrintData[]; }>({
      url: '/api/print/wms/waybill/queryWaybillPrintData',
      data,
      method: 'post',
    });

    await validateData(printData.data);
    await this.executePrint({
      ...data,
      preview,
      printer,
    }, printData.data);
  };

  /**
   * 有数据,直接打印
   */
  public readonly executePrint = async(params: PrintWayBillParams, printData: PrintData[]): Promise<void> => {
    await validateData(printData);

    for (let i = 0; i < printData.length; i++) {
      const waybillData = printData[i].waybillData;
      const tempData = waybillData.tempData;
      const userData = waybillData.userData;
      const shopType = printData[i].type;
      const newPrint = printData[i].newPrint;
      const courierPrintType = printData[i].courierPrintType;
      const cpCode = printData[i].cpCode;

      const callbackData = {
        callbackIds: waybillData.updateIds,
        checkSku: params.checkSku,
        printSrc: params.printSrc,
        docIds: waybillData.docIds,
      };

      if (await this.handleNotify(waybillData)) {
        switch (shopType) {
          case ENUM_SHOP_TYPE.jd:
            if (newPrint) {
              // TODO
            } else {
              await this.handleJDPrintOld(params, userData, tempData);
            }
            break;
          case ENUM_SHOP_TYPE.pdd:
            if (newPrint) {
              // TODO
            } else {
              await this.handlePddPrintOld(params, userData, tempData, courierPrintType);
            }
            break;
          case ENUM_SHOP_TYPE.rookie:
            if (newPrint) {
              // TODO
            } else {
              await this.handleRookiePrintOld(params, userData, tempData);
            }
            break;
          case ENUM_SHOP_TYPE.dy:
            if (newPrint) {
              // TODO
            } else {
              await this.handleDyPrintOld(params, userData, tempData);
            }
            break;
          case ENUM_SHOP_TYPE.ks:
            if (newPrint) {
              // TODO
            } else {
              await this.handleKsPrintOld(params, userData, tempData, cpCode);
            }
            break;
          default:
            message.error({
              key: `店铺类型:${shopType}不存在`,
              content: `店铺类型:${shopType}不存在`,
            });
            throw new Error(`店铺类型:${shopType}不存在`);
        }
        await this.updateStatus(callbackData);
      }
    }
  };

  private handleNotify = async(waybillData: PrintData['waybillData']) => {
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

  private handlePddPrintOld = async(params: PrintWayBillParams, userData: any[], tempData: TemplateData, courierPrintType: number) => {
    printHelper.toggleToPddOld();
    await printHelper.print({
      printer: params.printer,
      preview: params.preview,
      contents: userData,
      templateData: tempData,
      courierPrintType,
    });
  };

  private handleDyPrintOld = async(params: PrintWayBillParams, userData: any[], tempData: TemplateData) => {
    printHelper.toggleToDyOld();
    await printHelper.print({
      printer: params.printer,
      preview: params.preview,
      contents: userData,
      templateData: tempData,
    });
  };

  private handleRookiePrintOld = async(params: PrintWayBillParams, userData: any[], tempData: TemplateData) => {
    printHelper.toggleToRookie();
    await printHelper.print({
      printer: params.printer,
      preview: params.preview,
      contents: userData,
      templateData: tempData,
    });
  };

  private handleKsPrintOld = async(params: PrintWayBillParams, userData: any[], tempData: TemplateData, cpCode: string) => {
    printHelper.toggleToKsOld();
    await printHelper.print({
      printer: params.printer,
      preview: params.preview,
      contents: userData,
      templateData: tempData,
      cpCode,
    });
  };

  private handleJDPrintOld = async(params: PrintWayBillParams, userData: any[], tempData: TemplateData) => {
    printHelper.toggleToJdOld();
    await printHelper.print({
      printer: params.printer,
      preview: params.preview,
      contents: userData,
      templateData: tempData,
    });
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
