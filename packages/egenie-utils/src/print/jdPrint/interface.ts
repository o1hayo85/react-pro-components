export interface IParameters {
  printName: string;
  offsetTop?: number;
  offsetLeft?: number;
  tempUrl: string;
  printData: any[];
  customTempUrl?: string;
  customData?: any[];
}
export type TOrderType = 'PRE_View' | 'GET_Printers' | 'PRINT';

export interface RequestProtocol {
  orderType: TOrderType;
  key?: string;
  parameters: IParameters;
}

export interface IPrintResponse {
  code: '2' | '6' | '8';
  success: string;
  message: string;
  key?: string;
  content?: string;
  status?: string;
}
