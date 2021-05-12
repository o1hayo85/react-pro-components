import { request } from 'egenie-utils';
import React from 'react';
import styles from './index.module.less';

export default function() {
  React.useEffect(() => {
    request({ url: '/abcdef' })
      .then((info) => {
        console.log(info);
      });
  }, []);

  return (
    <div className={styles.container}>
      hello world
    </div>
  );
}
