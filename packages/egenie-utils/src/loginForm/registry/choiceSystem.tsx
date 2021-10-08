import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { api } from '../api';
import type { Props } from '../interface';
import styles from './index.less';

const data = [
  {
    id: 'ERP',
    name: '电商ERP',
    icon: 'erpbg.png',
    content: 'e精灵ERP系统聚焦于服装鞋帽行业，帮助电商企业打通线上与线下渠道、供应商协同，实现供销平衡、供应能力的弹性扩展、提升业务效率及资金运转能力。',
  },
  {
    id: 'POS',
    name: '供应管理系统',
    icon: 'posbg.png',
    content: 'e精灵POS系统是专为服装档口卖家打造的一款进销存管理系统，功能强大，稳定易用。帮助档口卖家精准管理库存和应收账款，提升工作效率。',
  },
  {
    id: 'SIMPLEERP',
    name: '精灵打单系统',
    icon: 'simpleErp.png',
    content: '精灵打单是e精灵ERP的简版系统，能够满足电商卖家基本的订单管理和打印发货需求。',
  },
];

@inject('store')
@observer
export default class Index extends React.Component<Props> {
  render(): JSX.Element {
    const { changeSystemType } = this.props.store;
    return (
      <div className={styles.choiceSystem}>
        <div className={styles.title}>
          选择注册系统
        </div>
        <div className={styles.content}>
          {data.map((item) => (
            <Button
              className={styles.item}
              key={item.id}
              onClick={changeSystemType.bind(this, item.id)}
            >
              <img
                className={styles.icon}
                src={`${api.oss}/images/${item.icon}`}
              />
              <div className={styles.name}>
                {item.name}
              </div>
              <div className={styles.description}>
                {item.content}
              </div>
            </Button>
          ))}
          
        </div>
      </div>
    );
  }
}
