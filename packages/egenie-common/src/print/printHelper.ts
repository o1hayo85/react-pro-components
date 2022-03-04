import { message } from 'antd';
import { JdPrint } from './jdPrint';
import { LodopPrint } from './lodopPrint';
import { RookieAndPddAndDyPrint } from './rookieAndPddAndDyPrint';
import type { DyPrintParams, JDParams, LodopPrintParams, PddPrintParams, RookiePrintParams } from './types';
import { formatDyData, formatPddData, formatPrintName, formatRookieData, sliceData } from './utils';

const openError = (platform: string) => `系统未连接打印控件\n。请在首页安装${platform}且正常启动打印组件后重启浏览器`;

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
   * 获取打印机列表。从任一一个插件获取到就可以，解决以前客户只是抖音、pdd、jd还需要安装菜鸟插件问题
   */
  public getPrinters = async(): Promise<string[]> => {
    const printPlugins: Array<RookieAndPddAndDyPrint | JdPrint | LodopPrint> = [
      this.rookiePrint,
      this.lodopPrint,
      this.dyPrint,
      this.pddPrint,
      this.jdPrint,
    ];

    let printers: string[] = [];
    for (let i = 0; i < printPlugins.length && printers.length === 0; i++) {
      try {
        printers = await printPlugins[i].getPrinters();
      } catch (e) {
        message.destroy();
        console.log(e, '尝试获取打印机错误，可忽略');
      }
    }

    if (printers.length) {
      return printers;
    } else {
      throw new Error('打印机列表为空,查看是否安装对应插件');
    }
  };

  /**
   * 打印(先切换打印机类型,否则后果自负)
   * @param params
   */
  public print = async(params: RookiePrintParams | PddPrintParams | JDParams | DyPrintParams | LodopPrintParams): Promise<any> => {
    if (this.state === this.jdPrint) {
      const newParams: JDParams = params;
      const customTempUrl = process.env.REACT_APP_JD_CUSTOM_TEMPLATE_URL || 'https://storage.360buyimg.com/jdl-template/custom-1d208dda-02c0-4a31-a3ae-6d88b2f256f3.1624851609527.txt';
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
            printer: formatPrintName(newParams.templateData, newParams.printer),
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
