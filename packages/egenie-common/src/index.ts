import type { Egenie, JsonReader, Permission, User } from './layoutMenu';

export { egeniePcTheme } from './theme';
export { formatNumber, add, subtract, multiple, toFixed, formatPrice, thousandthSeparator, objToDict, DictData, getStaticResourceUrl } from './helper';
export { request, BaseData, PaginationData, BatchReportData, PureData } from './request';
export { renderModal, destroyModal, destroyAllModal } from './renderModal';
export { Locale } from './locale';
export { RenderRoutes, MenuDataItem } from './renderRoutes';
export { history } from './history';
export { printHelper, formatBarcodeData, printWayBill, CustomPrintModal, getCustomPrintParam, getCustomPrintParamByDefaultTemplate, LodopPrint, getUUID } from './print';
export { playVoice, getAndPlayVoice } from './voice';
export { RenderByCondition } from './renderByCondition';
export * from './filterItems';
export * from './layoutMenu';

declare global {
  interface Window {
    user: User;
    jsonReader: JsonReader;

    // @ts-ignore
    egenie: Egenie;

    // @ts-ignore
    EgeniePermission: Permission;
  }
}
