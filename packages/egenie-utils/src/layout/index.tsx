import { Provider } from 'mobx-react';
import React from 'react';
import { SrcParams, Opera, Project } from './interface';
import { LayoutMenu } from './layoutMenu';
import { layoutStore } from './layoutStore';

export interface Props {
  children?: React.ReactNode;

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
   * iframe页面src携带参数
   */
  srcParams?: SrcParams[];

  /**
   * 项目信息
   */
  project?: Project;
}
export const LayoutGuide: React.FC<Props> = (props: Props) => {
  return (
    <Provider layoutStore={layoutStore}>
      <LayoutMenu
        defaultDashboard={props.defaultDashboard}
        haveDashboard={props.haveDashboard}
        project={props.project}
        srcParams={props.srcParams}
        userInfoLeft={props.userInfoLeft}
        userInfoRight={props.userInfoRight || []}
      />
    </Provider>
  );
};
