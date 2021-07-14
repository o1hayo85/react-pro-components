import { JDPrint } from './jdPrint';
import { RookieAndPddPrint } from './rookieAndPddPrint';
import { TemplateData } from './utils';

const openError = (platform: string) => `系统未连接打印控件\n。请在首页安装${platform}且正常启动打印组件后重启浏览器`;

function formatPrintName(tempData: TemplateData, printerName?: string) {
  if (printerName) {
    return printerName;
  } else {
    return tempData?.content?.printerName;
  }
}

function formatRookieData(printData: any[], printTemplate: TemplateData) {
  const contents = [];

  (printData || []).forEach((item) => {
    if (Number(printTemplate?.content?.cainiaoTemp) === 1 && item.newCaiNiao) {
      contents.push(JSON.parse(item.newCaiNiao));
    }

    delete item.newCaiNiao;

    contents.push({
      data: item,
      templateURL: item.templateURL ? item.templateURL : `${window.location.origin}/api/print/getCainiaoTempXml/${printTemplate?.id}`,
    });
  });

  return contents;
}

function formatPddData(printData: any[], printTemplate: TemplateData, courierPrintType: number) {
  const contents = [];

  (printData || []).forEach((item) => {
    if (item.newCaiNiao) {
      contents.push(JSON.parse(item.newCaiNiao));
    }
    delete item.newCaiNiao;

    if (item.pinduoduo) {
      contents.push({
        data: JSON.parse(item.pinduoduo),
        templateURL: courierPrintType ? 'https://egenie.oss-cn-beijing.aliyuncs.com/pdd/pdd_waybill_yilian_template.xml' : 'https://egenie.oss-cn-beijing.aliyuncs.com/pdd/pdd_waybill_seller_area_template.xml',
      });
    }
  });

  return contents;
}

export function formatBarcodeData(row: number, col: number, data: any[]): any[] {
  if (!(Array.isArray(data) && data.length)) {
    return [];
  }

  const height = row >>> 0;
  const width = col >>> 0;

  // 一页打多个条码
  if (height >= 1 && width >= 1 && (height > 1 || width > 1)) {
    const pageSize = width * height;
    const totalPage = (data.length / pageSize) >>> 0;
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
 * 公共参数
 */
export interface CommonParams {

  /**
   * 模版数据
   */
  templateData?: TemplateData;

  /**
   * 是否预览
   */
  preview: boolean;

  /**
   * 打印机
   */
  printer?: string;
}

/**
 * 菜鸟打印参数
 */
export type RookiePrintParams = {

  /**
   * 数据
   */
  contents?: any[];
} & CommonParams;

/**
 * pdd打印参数
 */
export type PddPrintParams = {

  /**
   * 数据
   */
  contents?: any[];

  /**
   * 快递类型
   */
  courierPrintType?: number;
} & CommonParams;

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
} & CommonParams;

export class PrintHelper {
  constructor() {
    this.toggleToRookie();
  }

  private state: RookieAndPddPrint | JDPrint;

  private rookiePrint: RookieAndPddPrint = new RookieAndPddPrint('127.0.0.1', 13528, openError('CAINIAO'));

  private pddPrint: RookieAndPddPrint = new RookieAndPddPrint('127.0.0.1', 5000, openError('拼多多'));

  private jdPrint: JDPrint = new JDPrint('127.0.0.1', 9113, openError('京东'));

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
   * 获取打印机列表
   */
  public getPrinters = (): Promise<string[]> => {
    return this.state.getPrinters();
  };

  /**
   * 打印(先切换打印机类型,否则后果自负)
   * @param params
   */
  public print = (params: RookiePrintParams | PddPrintParams | JDParams): Promise<any> => {
    if (this.state === this.jdPrint) {
      const newParams: JDParams = params;
      const customTempUrl = 'https://storage.360buyimg.com/jdl-template/custom-1d208dda-02c0-4a31-a3ae-6d88b2f256f3.1624851609527.txt';
      return this.state.print({
        preview: newParams.preview,
        printer: formatPrintName(newParams.templateData, newParams.printer),
        customData: newParams.customData ? [JSON.parse(newParams.customData)] : newParams.customData,
        customTempUrl: newParams.customTempUrl || customTempUrl,
        printData: newParams.printData,
        tempUrl: newParams.tempUrl,
      });
    } else if (this.state === this.rookiePrint) {
      const newParams: RookiePrintParams = params;
      const contents = formatRookieData(newParams.contents, newParams.templateData);
      return this.state.print({
        preview: newParams.preview,
        contents,
        printer: formatPrintName(newParams.templateData, newParams.printer),
      });
    } else if (this.state === this.pddPrint) {
      const newParams: PddPrintParams = params;
      const contents = formatPddData(newParams.contents, newParams.templateData, newParams.courierPrintType);
      return this.state.print({
        preview: newParams.preview,
        contents,
        printer: formatPrintName(newParams.templateData, newParams.printer),
      });
    } else {
      return Promise.reject();
    }
  };
}

export const printHelper = new PrintHelper();
