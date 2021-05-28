import { Provider } from 'mobx-react';
import React from 'react';
import Login from './login';
import { Store } from './store';

export interface Prop {

  /**
   * 提供路由展示忘记密码按钮，反之不展示。
   * 例如：/egenie-erp-home/findPasword。
   * 展示需要引入FindPassword组件，并在ruoute文件添加路由
   * 具体参考egenie-erp-home项目
  */
  changePasswordPath?: string;

  /**
   * 提供路由展示忘记注册按钮，反之不展示。
   * 例如：/egenie-erp-home/registry。
   * 展示需要引入Registry组件，同FindPassword组件
  */
  registryPath?: string;

  /**
   * 自定义注册页面，暂无
  */
  customChangePassword?: JSX.Element;

  /**
  * 自定义忘记密码，暂无
 */
  customRegistry?: JSX.Element;
}

const store = new Store();
export const LoginForm: React.FC<Prop> = (props: Prop) => {
  return (
    <Provider store={store}>
      <Login
        changePasswordPath={props.changePasswordPath}
        registryPath={props.registryPath}
      />
    </Provider>
  );
};

