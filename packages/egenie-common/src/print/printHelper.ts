import { message } from 'antd';
import { JdPrint } from './jdPrint';
import { LodopPrint } from './lodopPrint';
import { RookieAndPddAndDyPrint } from './rookieAndPddAndDyPrint';
import { CommonPrintParams, formatPrintName, getTemplateData, getUUID, sliceData, TemplateData } from './utils';

const openError = (platform: string) => `系统未连接打印控件\n。请在首页安装${platform}且正常启动打印组件后重启浏览器`;

function formatRookieData(printData: any[], printTemplate: TemplateData) {
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

function formatDyData(printData: any[]) {
  const documents: any[] = [];

  (printData || []).forEach((item) => {
    const contents = [];
    if (item?.dyData?.printData) {
      contents.push(JSON.parse(item?.dyData?.printData));
    }

    if (item?.dyData?.customData) {
      contents.push({
        data: JSON.parse(item?.dyData?.customData),
        templateURL: item?.dyData?.customTempUrl ? item?.dyData?.customTempUrl : 'https://front.runscm.com/customer-source/printTemp/dy2.xml',
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

function formatPddData(printData: any[], courierPrintType: number) {
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
        templateURL: courierPrintType ? 'https://egenie.oss-cn-beijing.aliyuncs.com/pdd/pdd_waybill_yilian_template.xml' : 'https://egenie.oss-cn-beijing.aliyuncs.com/pdd/pdd_waybill_seller_area_template.xml',
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

/**
 * lodop打印参数
 */
export type LodopPrintParams = CommonPrintParams & { contents: any[]; };

/**
 * 菜鸟打印参数
 */
export type RookiePrintParams = {

  /**
   * 打印数据
   */
  contents?: any[];
} & CommonPrintParams;

/**
 * 抖音打印参数
 */
type DyPrintParams = {

  /**
   * 打印数据
   */
  contents?: any[];
} & CommonPrintParams;

/**
 * pdd打印参数
 */
type PddPrintParams = {

  /**
   * 打印数据
   */
  contents?: any[];

  /**
   * 快递类型
   */
  courierPrintType?: number;
} & CommonPrintParams;

/**
 * jd打印参数
 */
export type JDParams = {

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
} & CommonPrintParams;

class PrintHelper {
  constructor() {
    this.toggleToRookie();
  }

  private state: RookieAndPddAndDyPrint | JdPrint | LodopPrint;

  private rookiePrint: RookieAndPddAndDyPrint = new RookieAndPddAndDyPrint('127.0.0.1', 13528, openError('CAINIAO'));

  private pddPrint: RookieAndPddAndDyPrint = new RookieAndPddAndDyPrint('127.0.0.1', 5000, openError('拼多多'));

  private dyPrint: RookieAndPddAndDyPrint = new RookieAndPddAndDyPrint('127.0.0.1', 13888, openError('抖音'));

  private jdPrint: JdPrint = new JdPrint('127.0.0.1', 9113, openError('京东'));

  private lodopPrint: LodopPrint = new LodopPrint();

  /**
   * 切换到lodop
   */
  public toggleToLodop = () => {
    this.state = this.lodopPrint;
  };

  /**
   * 切换到菜鸟
   */
  public toggleToRookie = () => {
    this.state = this.rookiePrint;
  };

  /**
   * 切换到pdd
   */
  public toggleToPdd = () => {
    this.state = this.pddPrint;
  };

  /**
   * 切换到jd
   */
  public toggleToJd = () => {
    this.state = this.jdPrint;
  };

  /**
   * 切换到dy
   */
  public toggleToDy = () => {
    this.state = this.dyPrint;
  };

  /**
   * 获取打印机列表
   */
  public getPrinters = (): Promise<string[]> => {
    return this.state.getPrinters();
  };

  /**
   * 打印(先切换打印机类型,否则后果自负)
   * @param params
   */
  public print = async(params: RookiePrintParams | PddPrintParams | JDParams | DyPrintParams | LodopPrintParams): Promise<any> => {
    if (this.state === this.jdPrint) {
      const newParams: JDParams = params;
      const customTempUrl = 'https://storage.360buyimg.com/jdl-template/custom-1d208dda-02c0-4a31-a3ae-6d88b2f256f3.1624851609527.txt';
      await this.state.print({
        preview: newParams.preview,
        printer: formatPrintName(newParams.templateData, newParams.printer),
        customData: newParams.customData ? [JSON.parse(newParams.customData)] : newParams.customData,
        customTempUrl: newParams.customTempUrl || customTempUrl,
        printData: newParams.printData,
        tempUrl: newParams.tempUrl,
      });
    } else if (this.state === this.rookiePrint) {
      const newParams: RookiePrintParams = params;
      const pageData = sliceData(newParams.contents, newParams.count);

      if (Array.isArray(pageData) && pageData.length) {
        for (let i = 0; i < pageData.length; i++) {
          const contents = formatRookieData(pageData[i], newParams.templateData);
          await this.state.print({
            preview: newParams.preview,
            contents,
            printer: formatPrintName(newParams.templateData, newParams.printer),
          });
        }
      } else {
        message.warning({
          key: '没数据',
          content: '没数据',
        });
        return Promise.reject();
      }
    } else if (this.state === this.dyPrint) {
      const newParams: DyPrintParams = params;
      const pageData = sliceData(newParams.contents, newParams.count);

      if (Array.isArray(pageData) && pageData.length) {
        for (let i = 0; i < pageData.length; i++) {
          const contents = formatDyData(pageData[i]);
          await this.state.print({
            preview: newParams.preview,
            contents,
            printer: formatPrintName(newParams.templateData, newParams.printer),
          });
        }
      } else {
        message.warning({
          key: '没数据',
          content: '没数据',
        });
        return Promise.reject();
      }
    } else if (this.state === this.pddPrint) {
      const newParams: PddPrintParams = params;
      const pageData = sliceData(newParams.contents, newParams.count);

      if (Array.isArray(pageData) && pageData.length) {
        for (let i = 0; i < pageData.length; i++) {
          const contents = formatPddData(pageData[i], newParams.courierPrintType);
          await this.state.print({
            preview: newParams.preview,
            contents,
            printer: formatPrintName(newParams.templateData, newParams.printer),
          });
        }
      } else {
        message.warning({
          key: '没数据',
          content: '没数据',
        });
        return Promise.reject();
      }
    } else if (this.state === this.lodopPrint) {
      const newParams: LodopPrintParams = params as LodopPrintParams;
      const pageData = sliceData(newParams.contents, newParams.count);
      if (Array.isArray(pageData) && pageData.length) {
        for (let i = 0; i < pageData.length; i++) {
          await this.state.print({
            preview: newParams.preview,
            printer: newParams.printer,
            contents: pageData[i],
            templateData: newParams.templateData,
          });
        }
      } else {
        message.warning({
          key: '没数据',
          content: '没数据',
        });
        return Promise.reject();
      }
    } else {
      return Promise.reject();
    }
  };
}

export const printHelper = new PrintHelper();
