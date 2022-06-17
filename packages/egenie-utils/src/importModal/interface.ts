import type { ReactNode } from 'react';

export interface ImportConditionGroup {
  title: string;
  key: string;
  value?: boolean;
  explain?: string | ReactNode;
  onChangeCallback?: (key: string, checked: boolean) => void;
}
export interface ImportModelProps {
  sheetName: string;
  importConditionGroup?: ImportConditionGroup[] ;
  otherParams?: {[key: string]: any; };
}

export interface StartImportingParams {
  importParam?: {[key: string]: string; };
  importParamShow?: string;
}
export interface ImportPercent{
  percent: string;
  taskStatus: number;
  failedOssUrl?: string;
}
