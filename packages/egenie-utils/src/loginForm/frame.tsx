import { Provider } from 'mobx-react';
import React from 'react';
import { api } from './api';
import styles from './index.less';
import { Props } from './interface';
import { Store } from './store';

export default class Index extends React.Component<Props> {
  public store = new Store(this.props);

  render(): JSX.Element {
    const { goToLogin, logoImg, logoText } = this.store;
    console.log('this.frame......', this.props, logoImg, logoText);
    return (
      <Provider store={this.store}>
        <div className={styles.frame}>
          <div className={styles.header}>
            <div>
              <img
                onClick={goToLogin}
                src={logoImg || `${api.oss}/images/logo.png`}
              />
              <span className={styles.title}>
                {logoText || '最专业的服装供应链服务商'}
              </span>
            </div>
            <span
              className={styles.login}
              onClick={goToLogin}
            >
              登录
              <img
                className={styles.loginIcon}
                src={`${api.oss}/images/arrowRight.png`}
              />
            </span>
          </div>
          {/* <Content/> */}
          {this.props.children}
          <div className={styles.footer}>
            依链（北京）科技有限公司© 版权所有｜京ICP备15065993号-1
          </div>
        </div>
      </Provider>
    );
  }
}
