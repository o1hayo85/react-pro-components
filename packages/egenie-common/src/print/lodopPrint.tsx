import { message } from 'antd';
import React from 'react';
import { LodopPrintParams } from './printHelper';
import { EnumLodopItemType, formatPrintName, getTemplateData, getUUID, LodopItem, TemplateData } from './utils';

declare global {
  interface Window {
    getCLodop?: any;
    CLODOP?: any;
  }
}

function zero75(size: number): number {
  return size * 0.75;
}

/*
function isWindows(): boolean {
  return navigator.platform == 'Win32' || navigator.platform == 'Windows';
}

function is64(): boolean {
  return /x64/i.test(navigator.userAgent);
}*/

function loadScripts(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const element = document.createElement('script');
    element.src = src;
    element.onload = function() {
      resolve();
    };
    element.onerror = function(e) {
      reject(e);
    };
    document.head.appendChild(element);
  });
}

function notifyUserDownloadPlugin() {
  message.info({
    content: (
      <div>
        打印控件未启动或者未安装，点击这里
        <a
          href="http://lodop.net/download.html"
          rel="noreferrer"
          target="_blank"
        >
          下载安装
        </a>
        <div>
          如果已安装,可点击这里
          <a
            href="CLodop.protocol:setup"
          >
            重新启动
          </a>
          ，然后刷新本页面
        </div>
      </div>),
    duration: 5,
  });
}

enum EnumJsLoadState {
  init,
  finish
}

export class LodopPrint {
  public static url8000 = 'http://localhost:8000/CLodopfuncs.js?priority=1';

  public static url18000 = 'http://localhost:18000/CLodopfuncs.js';

  public static licenses: Array<[string, string]> = [
    [
      '成都衫数科技有限公司',
      'E7C39FD5AB0D3D5E3C07D05CDCBF1465',
    ],
    [
      '成都衫數科技有限公司',
      '38341770D3075504D5DE79C86B4DEEEA',
    ],
  ];

  private baseLeft = 0;

  private baseTop = 0;

  private jsLoadState: EnumJsLoadState = EnumJsLoadState.init;

  private createItem = (itemList: LodopItem[], data: any) => {
    function getTxt(key: string, userDataCollection: any): string {
      let dataValue: string;
      const propsArr = key.split('.');
      if (propsArr.length <= 1) { // 字符串无小数点拆分直接取值，有小数点的转换后取值
        dataValue = userDataCollection[key];
      } else {
        dataValue = propsArr.reduce((takePre, takeCur) => takePre[takeCur], userDataCollection);
      }

      return (typeof dataValue === 'string' && dataValue && dataValue.length && dataValue.replace('[$data]', '')
        .replace('[&', '')
        .replace(']', '')) || dataValue;
    }

    function getCodeType(text: string): string {
      if (text.includes('128')) {
        return '128Auto';
      } else if (text.includes('Code39')) {
        return 'Code39';
      } else {
        return 'Code93';
      }
    }

    function setSkuDetail(itemData: LodopItem, userData: any): string {
      const {
        id,
        fontFamily,
        fontSize,
        alignment,
        weight,
      } = itemData;
      const idSplitArr: string[] = id.split(','); // id = 第一种 "skuList-sku.sku_no"  第二种"skuList-num"
      const collectionName = idSplitArr[0].split('-')[0];
      const userDataItem: string[] = userData[collectionName]; // 取userData中的skuList对应的集合
      const trStr: string[] = userDataItem.map((item) => {
        const tdStr: string[] = idSplitArr.map((tdCur) => {
          const takeValue = tdCur.split('-')[1];
          const propsArr = takeValue.split('.');
          if (propsArr.length <= 1) { // id是第二种直接取值 ,第一种需要转换小数点取值
            return `<td>${item[takeValue]}</td>`;
          } else {
            return `<td>${propsArr.reduce((takePre, takeCur) => takePre[takeCur], item)}</td>`;
          }
        });

        return `<tr>${tdStr.join('')}</tr>`;
      });

      return [
        `<style>td{border: 0px solid #000;height:18px;font-size:${zero75(fontSize)}px;font-family:${fontFamily};font-weight:${weight};text-align:${alignment};}</style>`,
        '<table border="0" cellSpacing="0" cellPadding="0"  width="100%" bordercolor="#000000" style="border-collapse:collapse">',
        trStr.join(''),
        '</table>',
      ].join('');
    }

    for (let i = 0; i < itemList.length; i++) {
      const {
        id,
        fontFamily,
        fontSize,
        hideText,
        txt,
        width,
        height,
        txttype,
        alignment,
        weight,
        left,
        top,
      } = itemList[i];
      const [
        collectionName,
        key,
      ] = id.split('-'); // 如wmsOrder-receiver_phone-40644-4870-uwrnik1g  collectionName = wmsOrder key = receiver_phone

      if (
        txttype === EnumLodopItemType.customText ||
        txttype === EnumLodopItemType.noTitleText ||
        txttype === EnumLodopItemType.hasTitleText ||
        txttype === EnumLodopItemType.tableInlineText ||
        txttype === EnumLodopItemType.printTime
      ) {
        this.instance.ADD_PRINT_TEXTA(id, top, left, width, height, txttype !== EnumLodopItemType.customText ? getTxt(key, data[collectionName]) : txt);
        this.instance.SET_PRINT_STYLEA(id, 'Alignment', alignment);
        this.instance.SET_PRINT_STYLEA(id, 'FontName', fontFamily);
        this.instance.SET_PRINT_STYLEA(id, 'FontSize', zero75(fontSize));
        if (weight > 400) {
          this.instance.SET_PRINT_STYLEA(id, 'Bold', 1); // 1 粗体 0非粗
        }
      } else if (txttype === EnumLodopItemType.qrCode) {
        this.instance.ADD_PRINT_BARCODE(top, left, width, height, 'QRCode', getTxt(key, data[collectionName]));
      } else if (txttype === EnumLodopItemType.barCode) {
        const showBarText = hideText ? !hideText.includes('不显示码值') : true;
        this.instance.ADD_PRINT_BARCODE(top, left, width, height, getCodeType(txt), getTxt(key, data[collectionName]));
        this.instance.SET_PRINT_STYLEA(0, 'ShowBarText', showBarText);
      } else if (txttype === EnumLodopItemType.img) {
        this.instance.ADD_PRINT_IMAGE(top, left, width, height, `<img src="${getTxt(key, data[collectionName])}" height="${height}px" width="${width}px"/>`);

        // TODO:设置“text文本”时，1代表两端对齐，0代表不处理（默认）； 设置“barcode条码文字”时，0-两端对齐(默认)  1-左靠齐  2-居中  3-右靠齐；
        //    LODOP.SET_PRINT_STYLEA(0, 'AlignJustify', alignment);
        this.instance.SET_PRINT_STYLEA(0, 'FontSize', zero75(fontSize));
      } else if (txttype === EnumLodopItemType.verticalLine) {
        // 竖线 intLineStyle 0--实线 1--破折线 2--点线 3--点划线 4--双点划线 intLineWidth 线条宽，整数型，单位是(打印)像素，缺省值是1，非实线的线条宽也是0
        // ADD_PRINT_LINE(Top1,Left1, Top2, Left2,intLineStyle, intLineWidth)
        this.instance.ADD_PRINT_LINE(top, left, top + height, left, 0, 1);
      } else if (txttype === EnumLodopItemType.horizontalLine) {
        this.instance.ADD_PRINT_LINE(top, left, top, left + width, 0, 1);
      } else if (txttype === EnumLodopItemType.rect) {
        this.instance.ADD_PRINT_RECT(top, left, width, height, 0, 1);
      } else if (txttype == EnumLodopItemType.skuDetail) {
        this.instance.ADD_PRINT_TABLE(top, left, width, height, setSkuDetail(itemList[i], data));
      }
    }
  };

  private initPageSize(templateData: TemplateData): void {
    const {
      pageWidth,
      pageHeight,
      intOrient = 1,
      strPageName = '',
    } = templateData;

    const pageW = `${pageWidth}mm`;
    const pageH = `${pageHeight}mm`;
    this.instance.PRINT_INITA(`${this.baseTop}mm`, `${this.baseLeft}mm`, pageW, pageH, strPageName);
    this.instance.SET_PRINT_PAGESIZE(intOrient, pageW, pageH, strPageName);
  }

  private sendToPrinter = async({
    preview,
    printer,
    templateData,
    contents,
  }: Omit<LodopPrintParams, 'count'>): Promise<void> => {
    await this.init();

    this.initPageSize(templateData);

    for (let i = 0; i < contents.length; i++) {
      // 新的一页
      this.instance.NewPage();
      this.createItem(Array.isArray(templateData.itemList) ? templateData.itemList : [], contents[i]);
    }

    // 打印任务
    const taskId = getUUID();
    this.instance.SET_PRINT_MODE('CUSTOM_TASK_NAME', taskId);

    // 设置打印机
    this.instance.SET_PRINTER_INDEX(formatPrintName(templateData, printer) || 0);

    if (!preview) {
      this.instance.SET_PRINT_MODE('CATCH_PRINT_STATUS', true);
    }

    // 预览逻辑
    if (preview) {
      this.instance.PREVIEW();
    } else {
      this.instance.PRINT();
    }
  };

  /**
   * 插件instance(先调用init，再获取)
   */
  private instance: any = null;

  /**
   * 初始化
   */
  private async init(): Promise<void> {
    if (this.instance) {
      return;
    }

    if (this.jsLoadState === EnumJsLoadState.finish) {
      notifyUserDownloadPlugin();
      return Promise.reject();
    } else {
      try {
        console.log('开始加载lodop文件');

        // 加载js
        await loadScripts(LodopPrint.url8000);
        await loadScripts(LodopPrint.url18000);
        console.log('加载lodop文件结束');

        // 获取instance
        this.instance = window.getCLodop();
        console.log('获取lodop插件instance成功');

        // 设置注册信息
        this.instance.SET_LICENSES(LodopPrint.licenses[0][0], LodopPrint.licenses[0][1], LodopPrint.licenses[1][0], LodopPrint.licenses[1][1]);

        console.log(`当前有WEB打印服务C-Lodop可用!\n C-Lodop版本:${this.instance.CVERSION}(内含Lodop${this.instance.VERSION})`);

        // 更新状态
        this.jsLoadState = EnumJsLoadState.finish;
      } catch (e) {
        console.log(e);

        // 更新状态
        this.jsLoadState = EnumJsLoadState.finish;
        return Promise.reject();
      }
    }
  }

  /**
   * 获取打印机
   */
  public async getPrinters(): Promise<string[]> {
    await this.init();

    const count = this.instance.GET_PRINTER_COUNT() >>> 0;
    const printers: string[] = [];
    for (let i = 0; i < count; i++) {
      printers.push(this.instance.GET_PRINTER_NAME(i));
    }
    return printers;
  }

  /**
   * 打印
   */
  public async print({
    preview,
    printer,
    templateData,
    contents,
  }: Omit<LodopPrintParams, 'count'>): Promise<void> {
    if (!(Array.isArray(contents) && contents.length)) {
      message.warning({
        key: '没数据',
        content: '没数据',
      });
      return Promise.reject();
    }

    await this.sendToPrinter({
      preview,
      printer,
      templateData: getTemplateData(templateData),
      contents,
    });
  }
}
