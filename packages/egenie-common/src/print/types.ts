export enum EnumShopType {
  rookie = 0,
  pdd = 1,
  jd = 2,
  dy = 3,
  ks = 4,
}

export enum EnumLodopItemType {
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

/**
 * 公共参数
 */
export class CommonPrintParams {
  /**
   * 一次打印数据页数(默认500)
   */
  public count?: number;

  /**
   * 模版数据
   */
  public templateData?: TemplateData;

  /**
   * 是否预览
   */
  public preview: boolean;

  /**
   * 打印机
   */
  public printer?: string;
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

  public txttype?: EnumLodopItemType;

  public alignment?: string;

  public height?: number;

  public hideText?: string;
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
 * 快手打印参数
 */
export type KSPrintParams = {

  /**
   * 打印数据
   */
  contents?: any[];
} & CommonPrintParams;

/**
 * 抖音打印参数
 */
export type DyPrintParams = {

  /**
   * 打印数据
   */
  contents?: any[];
} & CommonPrintParams;

/**
 * pdd打印参数
 */
export type PddPrintParams = {

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
