import { Provider } from 'mobx-react';
import React from 'react';
import { SrcParams, Opera, Permission } from './interface';
import { LayoutMenu } from './layoutMenu';
import { layoutStore } from './layoutStore';

interface Props {
  children?: React.ReactNode;
  userInfoLeft?: React.ReactNode; // 扩展头部左侧
  userInfoRight?: Opera[]; //  扩展头部右侧下拉列表
  haveDashboard?: boolean; // false,展示默认内容; true,展示图表
  defaultDashboard?: React.ReactNode; // hasveDashboard为false才生效，自定义首页内容
  srcParams?: SrcParams[]; // src携带的参数
}
export const LayoutGuide: React.FC<Props> = (props: Props) => {
  console.log('props.....root', props);
  return (
    <Provider layoutStore={layoutStore}>
      <LayoutMenu
        defaultDashboard={props.defaultDashboard}
        haveDashboard={props.haveDashboard}
        srcParams={props.srcParams}
        userInfoLeft={props.userInfoLeft}

        userInfoRight={props.userInfoRight || []}
      />
    </Provider>
  );
};
