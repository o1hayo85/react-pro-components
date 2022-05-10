import { message } from 'antd';
import { JdPrint } from './jdPrint';
import { KsPrint } from './ksPrint';
import { LodopPrint } from './lodopPrint';
import { PddAndDyPrint } from './pddAndDyPrint';
import { RookiePrint } from './rookiePrint';
import type { CommonPrintParams, KsPrintParamsOld, PddPrintParamsOld } from './types';
import { ENUM_PRINT_PLUGIN_TYPE } from './types';
import { formatDyDataNew, formatDyDataOld, formatKsDataNew, formatKsDataOld, formatPddDataNew, formatPddDataOld, formatPrintName, formatRookieDataNew, formatRookieDataOld, getCustomDataNew, getCustomTemplateUrlNew, getJdCustomTemplateUrlOld, sliceData, validateData } from './utils';

function openError(platform: string): string {
  return `系统未连接打印控件\n。请在首页安装${platform}且正常启动打印组件后重启浏览器`;
}

class PrintHelper {
  private state: ENUM_PRINT_PLUGIN_TYPE = ENUM_PRINT_PLUGIN_TYPE.rookieOld;

  private readonly rookiePrintPlugin = new RookiePrint('127.0.0.1', 13528, openError('CAINIAO'));

  private readonly pddPrintPlugin = new PddAndDyPrint('127.0.0.1', 5000, openError('拼多多'));

  private readonly dyPrintPlugin = new PddAndDyPrint('127.0.0.1', 13888, openError('抖音'));

  private readonly jdPrintPlugin = new JdPrint('127.0.0.1', 9113, openError('京东'));

  private readonly ksPrintPlugin = new KsPrint('127.0.0.1', 16888, openError('快手'));

  private readonly lodopPrintPlugin = new LodopPrint();

  /**
   * 切换到lodop
   */
  public readonly toggleToLodop = () => {
    this.state = ENUM_PRINT_PLUGIN_TYPE.lodop;
  };

  /**
   * 切换到菜鸟(旧版可以打面单、小票等)
   */
  public readonly toggleToRookie = () => {
    this.state = ENUM_PRINT_PLUGIN_TYPE.rookieOld;
  };

  public readonly toggleToRookieNew = () => {
    this.state = ENUM_PRINT_PLUGIN_TYPE.rookieNew;
  };

  public readonly toggleToPddOld = () => {
    this.state = ENUM_PRINT_PLUGIN_TYPE.pddOld;
  };

  public readonly toggleToPddNew = () => {
    this.state = ENUM_PRINT_PLUGIN_TYPE.pddNew;
  };

  public readonly toggleToJdOld = () => {
    this.state = ENUM_PRINT_PLUGIN_TYPE.jdOld;
  };

  public readonly toggleToJdNew = () => {
    this.state = ENUM_PRINT_PLUGIN_TYPE.jdNew;
  };

  public readonly toggleToDyOld = () => {
    this.state = ENUM_PRINT_PLUGIN_TYPE.dyOld;
  };

  public readonly toggleToDyNew = () => {
    this.state = ENUM_PRINT_PLUGIN_TYPE.dyNew;
  };

  public readonly toggleToKsOld = () => {
    this.state = ENUM_PRINT_PLUGIN_TYPE.ksOld;
  };

  public readonly toggleToKsNew = () => {
    this.state = ENUM_PRINT_PLUGIN_TYPE.ksNew;
  };

  /**
   * 获取打印机列表。从任一一个插件获取到就可以，解决以前客户只是抖音、pdd、jd还需要安装菜鸟插件问题
   */
  public readonly getPrinters = async(): Promise<string[]> => {
    const printPlugins = [
      this.lodopPrintPlugin,
      this.rookiePrintPlugin,
      this.dyPrintPlugin,
      this.pddPrintPlugin,
      this.jdPrintPlugin,
      this.ksPrintPlugin,
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
   */
  public readonly print = async(params: CommonPrintParams | PddPrintParamsOld | KsPrintParamsOld): Promise<any> => {
    switch (this.state) {
      case ENUM_PRINT_PLUGIN_TYPE.jdOld:
        await validateData(params.contents);
        for (let i = 0; i < params.contents.length; i++) {
          const { jdqlData } = params.contents[i];
          if (jdqlData) {
            await this.jdPrintPlugin.print({
              preview: params.preview,
              printer: formatPrintName(params.templateData, params.printer),
              printData: [jdqlData.printData],
              tempUrl: jdqlData.tempUrl,
              customTempUrl: getJdCustomTemplateUrlOld(jdqlData.customTempUrl),
              customData: jdqlData.customData ? [JSON.parse(jdqlData.customData)] : jdqlData.customData,
            });
          }
        }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.jdNew:
        await validateData(params.contents);
        for (let i = 0; i < params.contents.length; i++) {
          const { jdqlData } = params.contents[i];
          if (jdqlData) {
            await this.jdPrintPlugin.print({
              preview: params.preview,
              printer: formatPrintName(params.templateData, params.printer),
              printData: [jdqlData.printData],
              tempUrl: jdqlData.tempUrl,
              customTempUrl: getCustomTemplateUrlNew(params.contents[i]),
              customData: getCustomDataNew(params.contents[i]),
            });
          }
        }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.rookieOld: {
        const pageData = sliceData(params.contents, params.count);
        await validateData(pageData);

        for (let i = 0; i < pageData.length; i++) {
          const contents = formatRookieDataOld(pageData[i], params.templateData);
          await this.rookiePrintPlugin.print({
            preview: params.preview,
            contents,
            printer: formatPrintName(params.templateData, params.printer),
          });
        }
      }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.rookieNew: {
        const pageData = sliceData(params.contents, params.count);
        await validateData(pageData);

        for (let i = 0; i < pageData.length; i++) {
          const contents = formatRookieDataNew(pageData[i]);
          await this.rookiePrintPlugin.print({
            preview: params.preview,
            contents,
            printer: formatPrintName(params.templateData, params.printer),
          });
        }
      }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.dyOld: {
        const pageData = sliceData(params.contents, params.count);
        await validateData(pageData);

        for (let i = 0; i < pageData.length; i++) {
          const contents = formatDyDataOld(pageData[i]);
          await this.dyPrintPlugin.print({
            preview: params.preview,
            contents,
            printer: formatPrintName(params.templateData, params.printer),
          });
        }
      }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.dyNew: {
        const pageData = sliceData(params.contents, params.count);
        await validateData(pageData);

        for (let i = 0; i < pageData.length; i++) {
          const contents = formatDyDataNew(pageData[i]);
          await this.dyPrintPlugin.print({
            preview: params.preview,
            contents,
            printer: formatPrintName(params.templateData, params.printer),
          });
        }
      }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.ksOld: {
        const newParams: KsPrintParamsOld = params;

        // 快手建议10条以内
        const pageData = sliceData(newParams.contents, 10);
        await validateData(pageData);

        for (let i = 0; i < pageData.length; i++) {
          const contents = formatKsDataOld(pageData[i], newParams.cpCode);
          await this.ksPrintPlugin.print({
            preview: newParams.preview,
            contents,
            printer: formatPrintName(newParams.templateData, newParams.printer),
          });
        }
      }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.ksNew: {
        // 快手建议10条以内
        const pageData = sliceData(params.contents, 10);
        await validateData(pageData);

        for (let i = 0; i < pageData.length; i++) {
          const contents = formatKsDataNew(pageData[i]);
          await this.ksPrintPlugin.print({
            preview: params.preview,
            contents,
            printer: formatPrintName(params.templateData, params.printer),
          });
        }
      }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.pddOld: {
        const newParams: PddPrintParamsOld = params;
        const pageData = sliceData(newParams.contents, newParams.count);
        await validateData(pageData);

        for (let i = 0; i < pageData.length; i++) {
          const contents = formatPddDataOld(pageData[i], newParams.courierPrintType);
          await this.pddPrintPlugin.print({
            preview: newParams.preview,
            contents,
            printer: formatPrintName(newParams.templateData, newParams.printer),
          });
        }
      }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.pddNew: {
        const pageData = sliceData(params.contents, params.count);
        await validateData(pageData);

        for (let i = 0; i < pageData.length; i++) {
          const contents = formatPddDataNew(pageData[i]);
          await this.pddPrintPlugin.print({
            preview: params.preview,
            contents,
            printer: formatPrintName(params.templateData, params.printer),
          });
        }
      }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.lodop: {
        const pageData = sliceData(params.contents, params.count || 30);
        await validateData(pageData);

        for (let i = 0; i < pageData.length; i++) {
          await this.lodopPrintPlugin.print({
            preview: params.preview,
            printer: formatPrintName(params.templateData, params.printer),
            contents: pageData[i],
            templateData: params.templateData,
          });
        }
      }
        break;
      default:
        throw new Error('插件类型不存在,在外部被非法改掉');
    }
  };
}

export const printHelper = new PrintHelper();
