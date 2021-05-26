import { inject, observer } from 'mobx-react';
import React from 'react';
import { Props } from '../interface';
import ChoiceSystem from './choiceSystem';
import FormInfo from './formInfo';
import styles from './index.less';
import ResultMessage from './resultMessage';

@inject('store')
@observer
export default class Content extends React.Component<Props> {
  render(): JSX.Element {
    const { stepType } = this.props.store;
    const step: JSX.Element[] = [
      (<ChoiceSystem key="ChoiceSystem"/>),
      (<FormInfo key="FormInfo"/>),
      (<ResultMessage key="ResultMessage"/>),
    ];
    return (
      <div className={styles.content}>
        { step[stepType]}
      </div>
    );
  }
}
