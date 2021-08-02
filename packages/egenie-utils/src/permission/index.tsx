import React, { ReactElement, CSSProperties, ReactNode } from 'react';
import { request, BaseData } from '../request';

export interface IPermission {
  permissionId: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const getPerms = async(): Promise<void> => {
  if (window.top.EgeniePermission?.permissionList.length) {
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

export const hasPermission = async(permissionId: string): Promise<boolean> => {
  if (!window.top.EgeniePermission?.permissionList.length) {
    await getPerms();
    return false;
  } else {
    return window.top.EgeniePermission.permissionList.includes(permissionId);
  }
};

export const Permission = (props: IPermission): ReactElement => {
  return (
    <div
      className={props.className}
      style={{
        ...props.style,
        display: hasPermission(props.permissionId) ? 'inline-block' : 'none',
      }}
    >
      {props.children}
    </div>
  );
};
