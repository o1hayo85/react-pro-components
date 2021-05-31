import { JDPrint } from './jdPrint';
import { RookieAndPddPrint } from './rookieAndPddPrint';
import { TemplateData } from './utils';

const rookieOpenError = (platform: string) => `系统未连接打印控件\n。请在首页安装${platform}且正常启动打印组件后重启浏览器`;

function formatPrintName(tempData: TemplateData, printerName?: string) {
  if (printerName) {
    return printerName;
  } else {
    return tempData?.content?.printerName;
  }
}

function formatRookieData(printData: any[], printTemplate: TemplateData) {
  const contents = [];

  printData.forEach((item) => {
    if (Number(printTemplate.content.cainiaoTemp) === 1 && item.newCaiNiao) {
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

export class PrintHelper {
  constructor() {
    this.toggleToRookie();
  }

  private state: RookieAndPddPrint | JDPrint;

  private rookiePrint: RookieAndPddPrint = new RookieAndPddPrint('127.0.0.1', 13528, rookieOpenError('CAINIAO'));

  private pddPrint: RookieAndPddPrint = new RookieAndPddPrint('127.0.0.1', 5000, rookieOpenError('拼多多'));

  private jdPrint: JDPrint = new JDPrint('127.0.0.1', 9113, rookieOpenError('京东'));

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
  public print = (params: PrintParams): Promise<any> => {
    if (this.state === this.jdPrint) {
      return this.state.print({
        preview: params.preview,
        printer: formatPrintName(params.templateData, params.printer),
        customData: params.customData,
        customTempUrl: params.customTempUrl,
        printData: params.printData,
        tempUrl: params.tempUrl,
      });
    } else if (this.state === this.rookiePrint) {
      const contents = formatRookieData(params.contents, params.templateData);
      return this.state.print({
        preview: params.preview,
        contents,
        printer: formatPrintName(params.templateData, params.printer),
      });
    } else if (this.state === this.pddPrint) {
      const contents = params.contents;
      return this.state.print({
        preview: params.preview,
        contents,
        printer: formatPrintName(params.templateData, params.printer),
      });
    } else {
      return Promise.reject();
    }
  };
}

export const printHelper = new PrintHelper();
