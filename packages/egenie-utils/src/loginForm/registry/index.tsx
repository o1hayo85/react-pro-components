import React from 'react';
import Frame from '../frame';
import type { Props } from '../interface';
import Content from './content';

/**
 * 只需要在route文件中引入即可, 参考egenie-boss项目
 * 例如：
 * @example
 * { path: '/egenie-erp-home/registry',
    title: '注册,
    exact:true,
    component: Registry,
    loginPath: 'egenie-erp-home/login,
    logoText: '衫数科技运营管理平台'
}

* @inner loginPath:string 登录页面地址
* @inner logoImg:string 登录系统logo
* @inner logoText:string 登录系统标题
*/
export const Registry: React.FC = (props: Props) => {
  return (
    <Frame {...props}>
      <Content/>
    </Frame>
  );
};
