import { message } from 'antd';
import { getStaticResourceUrl } from '../helper';
import type { TemplateData } from './types';

export function isSocketConnected(socket: WebSocket, openError: string): boolean {
  if (null == socket) {
    message.error({
      content: openError,
      key: openError,
    });
    return false;
  }

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

    const newContent = {};
    for (const contentKey in content) {
      if (Object.prototype.hasOwnProperty.call(content, contentKey) && content[contentKey] != null && content[contentKey] !== '') {
        newContent[contentKey] = content[contentKey];
      }
    }

    return {
      ...rest,
      ...newContent,
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

export function get(data: any, path: string[]): any {
  let value = data;
  for (let i = 0; i < path.length; i++) {
    if ((typeof value === 'object' && value !== null) || Array.isArray(value)) {
      value = value[path[i]];
    }
  }

  return value;
}

// skuList-vendor_id-hz4692ym6 取前2个
export function lodopItemGetText(data: any, id: string): any {
  const path: string[] = [];
  const [
    key1,
    key2,
  ] = id.split('-');

  const key1Path: string[] = typeof key1 === 'string' ? key1.split('.') : [];
  for (let i = 0; i < key1Path.length; i++) {
    path.push(key1Path[i]);
  }

  const key2Path: string[] = typeof key2 === 'string' ? key2.split('.') : [];
  for (let i = 0; i < key2Path.length; i++) {
    path.push(key2Path[i]);
  }

  return get(data, path.filter(Boolean));
}

/**
 * 格式化条码数据
 * @param row 一页的行
 * @param col 一页的列
 * @param data 打印数据
 */
export function formatBarcodeData(row: number, col: number, data: any[]): any[] {
  if (!(Array.isArray(data) && data.length)) {
    return [];
  }

  const height = row >>> 0;
  const width = col >>> 0;

  // 一页打多个条码
  if (height >= 1 && width >= 1 && (height > 1 || width > 1)) {
    const pageSize = width * height;
    const totalPage = Math.ceil(data.length / pageSize);
    const result = Array(totalPage)
      .fill(null);

    data.forEach((item, index) => {
      const currentPage = (index / pageSize) >>> 0;
      const pagePosition = index % pageSize;
      const h = (pagePosition / width) >>> 0;
      const w = pagePosition % width;
      const itemKey = `item_${h}_${w}`;
      if (result[currentPage]) {
        result[currentPage][itemKey] = item;
      } else {
        result[currentPage] = { [itemKey]: item };
      }
    });

    return result;
  } else {
    return data;
  }
}

export function formatRookieData(printData: any[], printTemplate: TemplateData) {
  const documents: any[] = [];

  (printData || []).forEach((item) => {
    if (Number(getTemplateData(printTemplate)?.cainiaoTemp) === 1 && item.newCaiNiao) {
      documents.push(JSON.parse(item.newCaiNiao));
    }

    delete item.newCaiNiao;

    documents.push({
      data: item,
      templateURL: item.templateURL ? item.templateURL : `${window.location.origin}/api/print/getCainiaoTempXml/${getTemplateData(printTemplate)?.id}`,
    });
  });

  if (documents.length) {
    return [
      {
        documentID: getUUID(),
        contents: documents,
      },
    ];
  } else {
    return [];
  }
}

export function formatDyData(printData: any[]) {
  const documents: any[] = [];

  (printData || []).forEach((item) => {
    const contents = [];
    if (item?.dyData?.printData) {
      contents.push(JSON.parse(item?.dyData?.printData));
    }

    if (item?.dyData?.customData) {
      contents.push({
        data: JSON.parse(item?.dyData?.customData),
        templateURL: item?.dyData?.customTempUrl || process.env.REACT_APP_DY_CUSTOM_TEMPLATE_URL || getStaticResourceUrl('customer-source/printTemp/dy2.xml'),
      });
    }

    if (contents.length) {
      documents.push({
        documentID: getUUID(),
        contents,
      });
    }
  });

  return documents;
}

export function formatPddData(printData: any[], courierPrintType: number) {
  const documents: any[] = [];

  (printData || []).forEach((item) => {
    const contents = [];
    if (item.newCaiNiao) {
      contents.push(JSON.parse(item.newCaiNiao));
    }
    delete item.newCaiNiao;

    if (item.pinduoduo) {
      contents.push({
        data: JSON.parse(item.pinduoduo),
        templateURL: courierPrintType ? process.env.REACT_APP_PDD_TEMPLATE_URL_1 || getStaticResourceUrl('customer-source/printTemp/pdd_waybill_yilian_template.xml') : process.env.REACT_APP_PDD_TEMPLATE_URL_0 || getStaticResourceUrl('customer-source/printTemp/pdd_waybill_seller_area_template.xml'),
      });
    }

    if (contents.length) {
      documents.push({
        documentID: getUUID(),
        contents,
      });
    }
  });

  return documents;
}

export function getJdqlTemplateUrl(customUrl?: string): string {
  const defaultUrl = 'http://cloudprint.cainiao.com/template/standard/297499/5';
  return customUrl || process.env.REACT_APP_JDQL_TEMPLATE_URL || defaultUrl;
}

export function getJdCustomTemplateUrl(customUrl?: string): string {
  const defaultUrl = 'https://storage.360buyimg.com/jdl-template/custom-1d208dda-02c0-4a31-a3ae-6d88b2f256f3.1624851609527.txt';
  return customUrl || process.env.REACT_APP_JD_CUSTOM_TEMPLATE_URL || defaultUrl;
}
