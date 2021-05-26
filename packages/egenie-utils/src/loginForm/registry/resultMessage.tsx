import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { api } from '../api';
import { Props } from '../interface';
import styles from './index.less';

@inject('store')
@observer
export default class ResultMessage extends React.Component<Props> {
  render(): JSX.Element {
    const { goToLogin } = this.props.store;

    return (
      <div className={styles.resultMessage}>
        <img
          className={styles.choice}
          src={`${api.oss}/images/successCircle.png`}
        />
        <div className={styles.title}>
          注册信息已提交
        </div>
        <span className={styles.tips}>
          注册信息已提交，请耐心等待审核，审核通过后可登录使用。
        </span>
        <Button
          className={styles.primaryButton}
          onClick={goToLogin}
        >
          前往登录页
        </Button>

      </div>
    );
  }
}
