import { message } from 'antd';
import { getStaticResourceUrl } from '../helper';
import { JdPrint } from './jdPrint';
import { LodopPrint } from './lodopPrint';
import { RookieAndPddAndDyAndKsPrint } from './rookieAndPddAndDyAndKsPrint';
import type { CommonPrintParams, KsPrintParamsOld, PddPrintParamsOld } from './types';
import { ENUM_PRINT_PLUGIN_TYPE } from './types';
import { formatDyDataNew, formatDyDataOld, formatKsDataNew, formatKsDataOld, formatPddDataNew, formatPddDataOld, formatPrintName, formatRookieDataNew, formatRookieDataOld, getCustomTemplateUrlNew, getJdCustomTemplateUrlOld, loadScripts, sliceData, validateData } from './utils';

function openError(platform: string): string {
  return `系统未连接打印控件\n。请在首页安装${platform}且正常启动打印组件后重启浏览器`;
}

declare global {
  interface Window {
    ZPL_JSSDK: any;
  }
}

class PrintHelper {
  private state: ENUM_PRINT_PLUGIN_TYPE = ENUM_PRINT_PLUGIN_TYPE.rookieOld | ENUM_PRINT_PLUGIN_TYPE.lodop;

  private readonly rookiePrintPlugin = new RookieAndPddAndDyAndKsPrint('ws://127.0.0.1:13528', openError('菜鸟'));

  private readonly pddPrintPlugin = new RookieAndPddAndDyAndKsPrint('ws://127.0.0.1:5000', openError('拼多多'));

  private readonly dyPrintPlugin = new RookieAndPddAndDyAndKsPrint('ws://127.0.0.1:13888', openError('抖音'));

  private readonly ksPrintPlugin = new RookieAndPddAndDyAndKsPrint('ws://127.0.0.1:16888/ks/printer', openError('快手'));

  private readonly jdPrintPlugin = new JdPrint('ws://127.0.0.1:9113', openError('京东'));

  public readonly lodopPrintPlugin = new LodopPrint();

  /**
   * 切换到lodop---兼容原来
   */
  public readonly toggleToLodop = () => {
    this.state = ENUM_PRINT_PLUGIN_TYPE.lodop;
  };

  /**
   * 切换到菜鸟(旧版可以打面单、小票等)---兼容原来
   */
  public readonly toggleToRookie = () => {
    this.state = ENUM_PRINT_PLUGIN_TYPE.rookieOld;
  };

  /**
   * 获取打印机列表代理
   * 从任一一个插件获取到就可以，解决以前客户只是抖音、pdd、jd还需要安装菜鸟插件问题
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
   * 打印代理
   * 菜鸟旧版和lodop先切换打印类型,否则后果自负
   */
  public readonly print = async(params: CommonPrintParams | PddPrintParamsOld | KsPrintParamsOld): Promise<any> => {
    validateData(params.contents);
    params = {
      ...params,

      // 类型缩减需要
      state: params.state != null ? params.state : this.state,
    };
    const printer = formatPrintName(params.templateData, params.printer);

    switch (params.state) {
      case ENUM_PRINT_PLUGIN_TYPE.jdOld:
      case ENUM_PRINT_PLUGIN_TYPE.jdNew:
        for (let i = 0; i < params.contents.length; i++) {
          const { jdqlData } = params.contents[i];
          if (jdqlData) {
            await this.jdPrintPlugin.print({
              preview: params.preview,
              printer,
              printData: [jdqlData.printData],
              tempUrl: jdqlData.tempUrl,
              customData: jdqlData.customData ? [JSON.parse(jdqlData.customData)] : jdqlData.customData,
              customTempUrl: params.state === ENUM_PRINT_PLUGIN_TYPE.jdOld ? getJdCustomTemplateUrlOld(jdqlData.customTempUrl) : getCustomTemplateUrlNew(params.contents[i]),
            });
          } else {
            const error = '没有京东打印数据';
            message.error({
              key: error,
              content: error,
            });
            throw new Error(error);
          }
        }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.rookieOld:
      case ENUM_PRINT_PLUGIN_TYPE.rookieNew: {
        const pageData = sliceData(params.contents, params.count);

        for (let i = 0; i < pageData.length; i++) {
          const contents = params.state === ENUM_PRINT_PLUGIN_TYPE.rookieOld ? formatRookieDataOld(pageData[i], params.templateData) : formatRookieDataNew(pageData[i]);
          await this.rookiePrintPlugin.print({
            preview: params.preview,
            contents,
            printer,
          });
        }
      }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.dyOld:
      case ENUM_PRINT_PLUGIN_TYPE.dyNew: {
        const pageData = sliceData(params.contents, params.count);

        for (let i = 0; i < pageData.length; i++) {
          const contents = params.state === ENUM_PRINT_PLUGIN_TYPE.dyOld ? formatDyDataOld(pageData[i]) : formatDyDataNew(pageData[i]);
          await this.dyPrintPlugin.print({
            preview: params.preview,
            contents,
            printer,
          });
        }
      }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.ksOld: {
        const newParams: KsPrintParamsOld = params;

        // 快手建议10条以内
        const pageData = sliceData(newParams.contents, 10);

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

        for (let i = 0; i < pageData.length; i++) {
          const contents = formatKsDataNew(pageData[i]);
          await this.ksPrintPlugin.print({
            preview: params.preview,
            contents,
            printer,
          });
        }
      }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.pddOld: {
        const newParams: PddPrintParamsOld = params;
        const pageData = sliceData(newParams.contents, newParams.count);

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

        for (let i = 0; i < pageData.length; i++) {
          const contents = formatPddDataNew(pageData[i]);
          await this.pddPrintPlugin.print({
            preview: params.preview,
            contents,
            printer,
          });
        }
      }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.lodop: {
        const pageData = sliceData(params.contents, params.count);

        for (let i = 0; i < pageData.length; i++) {
          await this.lodopPrintPlugin.print({
            preview: params.preview,
            printer,
            contents: pageData[i],
            templateData: params.templateData,
          });
        }
      }
        break;
      case ENUM_PRINT_PLUGIN_TYPE.dw:
        if (!window.ZPL_JSSDK) {
          await loadScripts(getStaticResourceUrl('customer-source/printTemp/dw.js'));
        }

        for (let i = 0; i < params.contents.length; i++) {
          const item = (params.contents)[i];
          if (item?.dwData?.printData) {
            window.ZPL_JSSDK.tmsPrint(JSON.parse(item.dwData.printData), (err: string) => {
              console.log(err);
              message.error({
                key: String(err),
                content: String(err),
              });
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
