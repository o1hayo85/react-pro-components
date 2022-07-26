import type { ReactNode } from 'react';
import React, { CSSProperties, useState, useEffect } from 'react';
import type { BaseData } from '../request';
import { request } from '../request';

export interface IPermission {
  permissionId: string;
  children?: JSX.Element;
}
export const getPerms = async(): Promise<void> => {
  if (window.top.EgeniePermission?.permissionList.length) {
    return;
  }
  await request<BaseData<string[]>>({ url: '/api/iac/role/user/perms' })
    .then((res) => {
      if (!window.top.EgeniePermission) {
        window.top.EgeniePermission = {
          checkPermit: () => {
            console.log('checkPermit');
          },
          permissionList: res.data,
          getResourceId: () => {
            return '';
          },
          hasPermit: () => {
            return false;
          },
        };
      } else {
        window.top.EgeniePermission.permissionList = res.data;
      }
    });
};

export const hasPermission = (permissionId: string): boolean => {
  if (!window.top.EgeniePermission?.permissionList.length) {
    getPerms();
    return false;
  } else {
    return window.top.EgeniePermission.permissionList.includes(permissionId);
  }
};

export const Permission = (props: IPermission): JSX.Element => {
  const [
    display,
    setDisplay,
  ] = useState<boolean>(false);
  useEffect(() => {
    setDisplay(hasPermission(props.permissionId));
  }, [window.top.EgeniePermission?.permissionList.length]);

  if (!display) {
    return null;
  }
  return props.children;
};
