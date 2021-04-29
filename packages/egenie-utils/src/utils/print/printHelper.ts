import { PrintParams, RookieAndPddPrint } from './rookieAndPddPrint';
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
 * 打印前先切换打印机类型
 */
class PrintHelper {
  constructor() {
    this.toggleToRookie();
  }

  private state: RookieAndPddPrint;

  private rookiePrint: RookieAndPddPrint = new RookieAndPddPrint('127.0.0.1', 13528, rookieOpenError('CAINIAO'));

  private pddPrint: RookieAndPddPrint = new RookieAndPddPrint('127.0.0.1', 5000, rookieOpenError('拼多多'));

  public toggleToRookie = () => {
    this.state = this.rookiePrint;
  };

  public toggleToPdd = () => {
    this.state = this.pddPrint;
  };

  public getPrinters = (): Promise<string[]> => {
    return this.state.getPrinters();
  };

  public print = (params: PrintParams): Promise<any> => {
    let contents: any[];
    if (this.state === this.rookiePrint) {
      contents = formatRookieData(params.contents, params.templateData);
    } else {
      contents = params.contents;
    }

    return this.state.print({
      preview: params.preview,
      contents,
      printer: formatPrintName(params.templateData, params.printer),
    });
  };
}

export const printHelper = new PrintHelper();
