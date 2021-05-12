import { message } from 'antd';

export function isSocketConnected(socket: WebSocket, openError: string): boolean {
  if (null == socket) {
    message.error({
      content: openError,
      key: openError,
    });
    return false;
  } else {
    if (socket.readyState === WebSocket.OPEN) {
      return true;
    } else {
      message.warn({
        key: '打印机正在连接',
        content: '打印机正在连接',
      });
      return false;
    }
  }
}

export interface TemplateData {
  mysqlid?: number;
  mysqlno?: string;
  _id?: number;
  id?: number;
  templateType?: any;
  content?: {
    colsCount?: string;
    ddlfontsize?: number;
    category_no?: string;
    pageHeight?: string;
    bkimgHeight?: string;
    pageWidth?: string;
    inRow?: string;
    tempName?: string;
    cainiaoTempXml?: string;
    id?: string;
    rowCount?: string;
    backgrd?: string;
    moren_fontfamliy?: string;
    courierNo?: any;
    tempType?: string;
    productType?: any;
    inCols?: string;
    textAlign?: string;
    printerName?: string;
    mysqlno?: string;
    updateTime?: string;
    mysqlid?: string;
    cainiaoTemp?: string;
  };
}

/**
 * 打印参数
 */
export interface PrintParams {

  /**
   * 模版数据
   */
  templateData?: TemplateData;

  /**
   * 是否预览
   */
  preview: boolean;

  /**
   * 数据
   */
  contents?: any[];

  /**
   * 打印机
   */
  printer?: string;

  /**
   * 京东打印自定义数据
   */
  customData?: any;

  /**
   * 京东打印自定义模板URL
   */
  customTempUrl?: string;

  /**
   * 京东打印固定数据
   */
  printData?: any;

  /**
   * 京东固定模板
   */
  tempUrl?: string;
}

export function getUUID(len?: number, radix?: number): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  if (len) {
    for (let i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * (radix || chars.length))];
    }
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

