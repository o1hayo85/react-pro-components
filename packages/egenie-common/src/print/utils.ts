import { message } from 'antd';

export enum EnumShopType {
  rookie = 0,
  pdd = 1,
  jd = 2,
  dy = 3,
}

export enum EnumLodopItemType {
  customText = '0',
  noTitleText = '1',
  hasTitleText = '2',
  tableInlineText = '3',
  printTime = 'printTime',
  qrCode = 'erweima',
  detailQrCode = 'erweima-detail',
  barCode = 'tiaoxingma',
  detailBarCode = 'tiaoxingma-detail',
  img = 'customImge',
  horizontalLine = 'hengxian',
  verticalLine = 'shuxian',
  rect = 'juxing',
  skuDetail = 'skudetail'
}

/**
 * 公共参数
 */
export class CommonPrintParams {
  /**
   * 一次打印数据页数(默认500)
   */
  public count?: number;

  /**
   * 模版数据
   */
  public templateData?: TemplateData;

  /**
   * 是否预览
   */
  public preview: boolean;

  /**
   * 打印机
   */
  public printer?: string;
}

export class TemplateData {
  public _id?: number | string;

  public id?: number | string;

  public defalt?: number;

  public templateType?: any;

  public colsCount?: string;

  public ddlfontsize?: number;

  public category_no?: string;

  public pageHeight?: string;

  public bkimgHeight?: string;

  public pageWidth?: string;

  public inRow?: string;

  public empName?: string;

  public cainiaoTempXml?: string;

  public rowCount?: string;

  public backgrd?: string;

  public moren_fontfamliy?: string;

  public courierNo?: any;

  public tempType?: string;

  public productType?: any;

  public inCols?: string;

  public textAlign?: string;

  public printerName?: string;

  public mysqlno?: string;

  public updateTime?: string;

  public mysqlid?: string | number;

  public cainiaoTemp?: string;

  /**
   * 1---纵(正)向打印，固定纸张
   * 2---横向打印，固定纸张
   * 3---纵(正)向打印，宽度固定，高度按打印内容的高度自适应；
   */
  public intOrient?: 1 | 2 | 3;

  public itemList?: LodopItem[];

  public itemDetailList?: {[key: string]: LodopItem; };

  public strPageName?: string;

  public content?: TemplateData;
}

export class LodopItem {
  public orderValue?: string;

  public txt?: string;

  public fontFamily?: string;

  public top?: number;

  public left?: number;

  public width?: number;

  public weight?: number;

  public fontSize?: number;

  public id?: string;

  public txttype?: EnumLodopItemType;

  public alignment?: string;

  public height?: number;

  public hideText?: string;
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

export function getTemplateData(tempData: TemplateData): Omit<TemplateData, 'content'> {
  if (tempData?.content && tempData.content && Object.keys(tempData.content).length > 0) {
    const {
      content,
      ...rest
    } = tempData;

    return {
      ...rest,
      ...content,
    };
  } else {
    return tempData;
  }
}

export function formatPrintName(tempData: TemplateData, printerName?: string) {
  if (printerName) {
    return printerName;
  } else {
    return getTemplateData(tempData)?.printerName;
  }
}

export function sliceData(data: any[], count = 500): any[][] {
  if (!(Array.isArray(data) && data.length)) {
    return [];
  }

  const result: any[][] = [];
  data.forEach((item, index) => {
    const currentPage = (index / count) >>> 0;
    if (result[currentPage]) {
      result[currentPage].push(item);
    } else {
      result[currentPage] = [item];
    }
  });
  return result;
}

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
