import { inject, observer } from 'mobx-react';
import React from 'react';
import styles from './layoutMenu.less';

@inject('layoutStore')
@observer
export class Home extends React.Component<any> {
  render() {
    const { activeTabKey } = this.props.layoutStore;
    const visible = activeTabKey == 0;

    return (
      <div
        id={styles.layoutHome}
        style={{ display: visible ? 'flex' : 'none' }}
      >
        {this.props.defaultDashboard}
      </div>
    );
  }
}
