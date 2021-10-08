import type { ReactNode } from 'react';

export interface Props {
  children?: ReactNode;
  store?;
  changePasswordPath?: string;
  registryPath?: string;
  loginPath?: string;
  customChangePassword?: JSX.Element;
  customRegistry?: JSX.Element;
}

export interface Response {
  status: string;
  data?;
}

export interface Market {
  id: number;
  marketName: string;
  [propName: number]: string;
}

export interface LoginParams {
  username: string;
  password: string;
  browserCode: string; // 浏览器ID
  eid?: string; // 设备ID
  smsCode?: string; // 验证码
  authImage?: string; // 验证图
  mobile?: string;
}

export interface LoginForm {
  username: string;
  password: string;
  authImage?: string; // 验证图
}

export interface FindPasswordForm {
  username?: string;
  code?: string;
  newPassword?: string;
  repeatPassword?: string;
}

export interface SelectOption {
  label?: string;
  value?: number;
  isLeaf?: boolean;
  children?: SelectOption[];
  [keyName: string]: any;
}
