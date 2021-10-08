import { Form, Input, Button } from 'antd';
import { history } from 'egenie-common';
import { inject, observer } from 'mobx-react';
import React from 'react';
import type { Props } from '../interface';
import styles from './index.less';

if (!localStorage.browserCode) {
  const agent = navigator.userAgent.toLowerCase();
  const regStrChrome = /chrome\/[\d.]+/gi;
  if (agent.indexOf('chrome') > 0) {
    const chromeCode = agent.match(regStrChrome);
    localStorage.browserCode = chromeCode[0];
  }
}
@inject('store')
@observer
export default class LoginContent extends React.Component<Props> {
  componentDidMount() {
    this.props.store.init();
  }

  public handleSubmit(values: { username: string; password: string; smsCode?; }): void {
    const { handleLogin } = this.props.store;
    return handleLogin(values);
  }

  render(): JSX.Element {
    const { errorInfo, loginFormRef, authimageneed, validateImage, changeAuthImage, handleFieldsChange } = this.props.store;
    const { registryPath, changePasswordPath } = this.props;
    console.log('this..prfffff', this.props);
    return (
      <div className={styles.loginForm}>
        <div className={styles.content}>
          <div className={styles.title}>
            账号登录
          </div>
          <div className={styles.form}>
            <Form
              onFieldsChange={handleFieldsChange}
              onFinish={this.handleSubmit.bind(this)}
              ref={loginFormRef}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: '请输入账号',
                  },
                ]}
              >
                <Input
                  autoComplete="on"
                  className={styles.input}
                  placeholder="请输入账号"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[

                  {
                    required: true,
                    message: '请输入密码',
                  },
                ]}
              >
                <Input
                  className={styles.input}
                  placeholder="请输入密码"
                  type="password"

                />

              </Form.Item>
              {authimageneed && (
                <Form.Item
                  name="authImage"
                  rules={[
                    {
                      required: true,
                      message: '请录入图片验证码!',
                    },
                  ]}
                >
                  <div>
                    <Input
                      className={styles.input}
                      placeholder="验证码，不区分大小写"
                    />
                    <img
                      onClick={changeAuthImage}
                      src={`/api/iac/authImage/anon/getAuthImage?${validateImage}`}
                      title="看不清，换一张"
                    />
                  </div>
                </Form.Item>
              )}
              <Form.Item>
                <Button
                  className={styles.submit}
                  htmlType="submit"
                  type="primary"
                >
                  登录
                </Button>
              </Form.Item>

            </Form>
            <span className={styles.error}>
              {errorInfo}
            </span>
          </div>
          <div className={styles.others}>
            <span
              className={styles.registry}
              onClick={() => history.push(registryPath)}
              style={{ visibility: registryPath ? 'visible' : 'hidden' }}
            >
              注册账号
            </span>
            <span
              onClick={() => history.push(changePasswordPath)}
              style={{ visibility: changePasswordPath ? 'visible' : 'hidden' }}
            >
              忘记密码
            </span>
          </div>
        </div>
      </div>
    );
  }
}
