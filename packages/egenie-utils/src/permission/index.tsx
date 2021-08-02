import React, { ReactElement, CSSProperties, ReactNode, useState, useEffect } from 'react';
import { request, BaseData } from '../request';

export interface IPermission {
  permissionId: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
export const getPerms = async(): Promise<void> => {
  if (window.top.EgeniePermission?.permissionList.length) {
    console.log('getPerms', window.top.EgeniePermission?.permissionList.length);
    return;
  }
  await request<BaseData<string[]>>({ url: '/api/iac/role/user/perms' })
    .then((res) => {
      console.log('res', res);
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
    console.log('hasPermission', window.top.EgeniePermission?.permissionList.length);
    getPerms();
    return false;
  } else {
    return window.top.EgeniePermission.permissionList.includes(permissionId);
  }
};

export const Permission = (props: IPermission): ReactElement => {
  const [
    display,
    setDisplay,
  ] = useState<boolean>(false);
  useEffect(() => {
    setDisplay(hasPermission(props.permissionId));
  }, [window.top.EgeniePermission?.permissionList.length]);
  return (
    <div
      className={props.className}
      style={{
        ...props.style,
        display: display ? 'inline-block' : 'none',
      }}
    >
      {props.children}
    </div>
  );
};
