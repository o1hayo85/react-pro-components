import { message, Modal } from 'antd';
import React from 'react';
import { destroyModal, renderModal } from '../renderModal';
import { request } from '../request';
import { CustomPrintModal } from './customPrint';
import { printHelper } from './printHelper';

/**
 * 重要参数preview、userDataIds、tempType、printSrc
 */
export interface PrintWayBillParams {

  /**
   * 模版类型
   * '0': '快递单',
   * '1': '发货单',
   * '2': '捡货单',
   * '4': '商品信息',
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

export class PrintWayBill {
  /**
   * 前置打印
   * @param preview
   * @param rest
   */
  public frontPrint = async({
    preview,
    ...rest
  }: PrintWayBillParams): Promise<void> => {
    await new Promise((resolve, reject) => {
      Modal.confirm({
        content: preview ? '确定预览' : '确定打印',
        onOk: () => resolve(true),
        onCancel: () => reject(),
      });
    });
    await this.getDataAndPrint({
      preview,
      ...rest,
      printSrc: '1',
      checkPrint: true,
    });
  };

  /**
   * 自定义打印
   * @param params
   */
  public customPrint = async(params: PrintWayBillParams): Promise<void> => {
    // 防止多次渲染Modal
    await new Promise((resolve, reject) => {
      Modal.confirm({
        content: '确定自定义打印?',
        onOk: () => resolve(true),
        onCancel: () => reject(),
      });
    });

    const customParams: PrintWayBillParams = await new Promise((resolve, reject) => {
      function handleOk(customParams) {
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
          tempType="0"
        />
      );
    });

    await this.getDataAndPrint({
      ...params,
      ...customParams,
    });
  };

  /**
   * 获取数据并且打印
   * @param preview
   * @param printer
   * @param rest
   */
  public getDataAndPrint = async({
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

    const printData = await request<any>({
      url: '/api/print/wms/waybill/queryWaybillPrintData',
      data,
      method: 'post',
    });

    if (Array.isArray(printData.data) && printData.data.length) {
      await this.executePrint({
        ...data,
        preview,
        printer,
      }, printData.data);
    } else {
      message.error('没有数据');
      return Promise.reject('没有数据');
    }
  };

  /**
   * 有数据,直接打印
   * @param params
   * @param printData
   */
  public executePrint = async(params: PrintWayBillParams, printData: any[]): Promise<void> => {
    if (!(printData && Array.isArray(printData) && printData.length)) {
      message.error('没有数据');
      return Promise.reject('没有数据');
    }

    for (let i = 0; i < printData.length; i++) {
      const waybillData = printData[i].waybillData;
      const tempData = waybillData.tempData;
      const userData = waybillData.userData;

      const printerData = {
        printer: params.printer,
        preview: params.preview,
        contents: userData,
        templateData: tempData,
      };

      const callbackData = {
        callbackIds: waybillData.updateIds,
        checkSku: params.checkSku,
        printSrc: params.printSrc,
        docIds: waybillData.docIds,
      };

      // pdd jd taobao只能分批次只打同一种快递
      if (userData[0]?.jdqlData) {
        printHelper.toggleToJd();
        for (let j = 0; j < userData.length; j++) {
          const { jdqlData } = userData[j];
          if (jdqlData) {
            const { customData, customTempUrl, printData, tempUrl } = jdqlData;
            const jdPrinterData = {
              printer: params.printer,
              preview: params.preview,
              customData,
              customTempUrl,
              printData,
              tempUrl,
              templateData: tempData, // FIXME: 是否需要这个字段来获取默认打印机？
            };
            await printHelper.print(jdPrinterData);
          }
        }
      } else { // TODO: Pdd打印
        printHelper.toggleToRookie();
        await printHelper.print(printerData);
      }

      await this.updateStatus(callbackData);
    }
  };

  private updateStatus = (data): Promise<any> => {
    return request({
      url: '/api/print/wms/waybill/updateWaybillPrintCallback',
      method: 'post',
      data,
    });
  };
}

export const printWayBill = new PrintWayBill();
