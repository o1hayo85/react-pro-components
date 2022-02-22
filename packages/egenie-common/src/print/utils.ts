import { message } from 'antd';
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
      if (Object.prototype.hasOwnProperty.call(content, contentKey)) {
        if (content[contentKey]) {
          newContent[contentKey] = content[contentKey];
        }
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

  /*  if (typeof value === 'string') {
      return value.replace('[$data]', '')
        .replace('[&', '')
        .replace(']', '');
    } else {
      return value;
    }*/
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
        templateURL: item?.dyData?.customTempUrl ? item?.dyData?.customTempUrl : 'https://front.ejingling.cn/customer-source/printTemp/dy2.xml',
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
    const content = [];
    if (item.newCaiNiao) {
      content.push(JSON.parse(item.newCaiNiao));
    }
    delete item.newCaiNiao;

    if (item.pinduoduo) {
      content.push({
        data: JSON.parse(item.pinduoduo),
        templateURL: courierPrintType ? 'https://front.ejingling.cn/customer-source/printTemp/pdd_waybill_yilian_template.xml' : 'https://front.ejingling.cn/customer-source/printTemp/pdd_waybill_seller_area_template.xml',
      });
    }

    if (content.length) {
      documents.push({
        documentID: getUUID(),
        contents: content,
      });
    }
  });

  return documents;
}
