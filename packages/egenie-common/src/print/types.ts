export enum ENUM_WAY_BILL_TYPE {
  rookie = 0,
  pdd = 1,
  jd = 2,
  dy = 3,
  ks = 4,
  dw = 5,
}

export enum ENUM_PRINT_PLUGIN_TYPE {
  rookieOld,
  rookieNew,
  pddOld,
  pddNew,
  dyOld,
  dyNew,
  jdOld,
  jdNew,
  ksOld,
  ksNew,
  lodop,
  dw,
}

export enum ENUM_LODOP_ITEM_TYPE {
  customText = '0',
  noTitleText = '1',
  hasTitleText = '2',
  tableInlineText = '3',
  printTime = 'printTime',
  qrCode = 'erweima',
  detailQrCode = 'erweima-detail',
  barCode = 'tiaoxingma',
  detailBarCode = 'tiaoxingma-detail',
  img = 'customImge',
  horizontalLine = 'hengxian',
  verticalLine = 'shuxian',
  rect = 'juxing',
  skuDetail = 'skudetail'
}

export class TemplateData {
  public _id?: number | string;

  public id?: number | string;

  public defalt?: number;

  public templateType?: any;

  public colsCount?: string;

  public ddlfontsize?: number;

  public category_no?: string;

  public pageHeight?: string;

  public bkimgHeight?: string;

  public pageWidth?: string;

  public inRow?: string;

  public empName?: string;

  public cainiaoTempXml?: string;

  public rowCount?: string;

  public backgrd?: string;

  public moren_fontfamliy?: string;

  public courierNo?: any;

  public tempType?: string;

  public productType?: any;

  public inCols?: string;

  public textAlign?: string;

  public printerName?: string;

  public mysqlno?: string;

  public updateTime?: string;

  public mysqlid?: string | number;

  public cainiaoTemp?: string;

  /**
   * 1---纵(正)向打印，固定纸张
   * 2---横向打印，固定纸张
   * 3---纵(正)向打印，宽度固定，高度按打印内容的高度自适应；
   */
  public intOrient?: 1 | 2 | 3;

  public itemList?: LodopItem[];

  public itemDetailList?: {[key: string]: LodopItem; };

  public strPageName?: string;

  public content?: TemplateData;
}

export class LodopItem {
  public orderValue?: string;

  public txt?: string;

  public fontFamily?: string;

  public top?: number;

  public left?: number;

  public width?: number;

  public weight?: number;

  public fontSize?: number;

  public id?: string;

  public txttype?: ENUM_LODOP_ITEM_TYPE;

  public alignment?: string;

  public height?: number;

  public hideText?: string;
}

/**
 * 基本打印参数
 */
export interface BasePrintParams {

  /**
   * 一次打印数据页数(默认500)
   */
  count?: number;

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

  /**
   * 打印数据
   */
  contents?: any[];
}

/**
 * 公共参数
 */
export interface CommonPrintParams extends BasePrintParams {
  state?: ENUM_PRINT_PLUGIN_TYPE.rookieOld
  | ENUM_PRINT_PLUGIN_TYPE.rookieNew
  | ENUM_PRINT_PLUGIN_TYPE.jdOld
  | ENUM_PRINT_PLUGIN_TYPE.jdNew
  | ENUM_PRINT_PLUGIN_TYPE.dyOld
  | ENUM_PRINT_PLUGIN_TYPE.dyNew
  | ENUM_PRINT_PLUGIN_TYPE.pddNew
  | ENUM_PRINT_PLUGIN_TYPE.ksNew
  | ENUM_PRINT_PLUGIN_TYPE.lodop
  | ENUM_PRINT_PLUGIN_TYPE.dw;
}

export interface KsPrintParamsOld extends BasePrintParams {
  state: ENUM_PRINT_PLUGIN_TYPE.ksOld;
  cpCode?: string;
}

export interface PddPrintParamsOld extends BasePrintParams {
  state: ENUM_PRINT_PLUGIN_TYPE.pddOld;

  /**
   * 快递类型
   */
  courierPrintType?: number;
}

export interface PrintAbstract {
  getPrinters: () => Promise<string[]>;
  print: (...arg: any[]) => Promise<any>;
}
