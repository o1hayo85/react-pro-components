import type { Egenie, JsonReader, Permission, User } from './layoutMenu';

export { formatNumber, add, subtract, multiple, toFixed, formatPrice, thousandthSeparator, objToDict, DictData } from './helper';
export { request, BaseData, PaginationData, BatchReportData, PureData } from './request';
export { renderModal, destroyModal, destroyAllModal } from './renderModal';
export { Locale } from './locale';
export { RenderRoutes, MenuDataItem } from './renderRoutes';
export { history } from './history';
export { printHelper, formatBarcodeData, printWayBill, CustomPrintModal, getCustomPrintParam, getSensitiveData, getCustomPrintParamByDefaultTemplate } from './print';
export { playVoice, getAndPlayVoice } from './voice';
export * from './filterItems';
export * from './layoutMenu';

declare global {
  interface Window {
    user: User;
    jsonReader: JsonReader;
    egenie: Egenie;
    EgeniePermission: Permission;
    __config__: {
      originProject: string;
      [key: string]: any;
    };
  }
}
