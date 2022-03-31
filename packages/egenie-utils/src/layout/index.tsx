import { Provider } from 'mobx-react';
import React from 'react';
import type { Opera } from './interface';
import { LayoutMenu } from './layoutMenu';
import type { ILayoutStore } from './layoutStore';

export interface Props {
  children?: React.ReactNode;
  /**
   * 状态模型
   */
  store: ILayoutStore;

  /**
   * 扩展头部左侧
   */
  userInfoLeft?: React.ReactNode;

  /**
   * 扩展头部右侧下拉列表
   */
  userInfoRight?: Opera[];

  /**
   * 自定义首页内容
   */
  defaultDashboard?: React.ReactNode;

  /**
   * false首页则展示空白页. 设置defaultDashboard即可，此属性暂时不用了
   */
  haveDashboard?: boolean;

  /**
   * log图片
   */
  logoImg?: React.ReactNode;
}
export const LayoutGuide: React.FC<Props> = (props: Props) => {
  return (
    <Provider layoutStore={props.store}>
      <LayoutMenu
        defaultDashboard={props.defaultDashboard}
        haveDashboard={props.haveDashboard}
        logoImg={props.logoImg}
        userInfoLeft={props.userInfoLeft}
        userInfoRight={props.userInfoRight || []}
      />
    </Provider>
  );
};
export * from './layoutStore';
