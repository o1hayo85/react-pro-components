import { Provider } from 'mobx-react';
import React from 'react';
import Login from './login';
import { Store } from './store';

interface Props {
  customChangePassword?: JSX.Element; // 自定义注册页面
  customRegistry?: JSX.Element; // 自定义忘记密码
  changePasswordPath?: string; // 展示忘记密码按钮
  registryPath?: string; // 展示注册按钮
}

const store = new Store();
export const LoginForm: React.FC<Props> = (props: Props) => {
  return (
    <Provider store={store}>
      <Login
        changePasswordPath={props.changePasswordPath}
        registryPath={props.registryPath}
      />
    </Provider>
  );
};

