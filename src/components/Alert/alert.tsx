import React, { FC, useState, useEffect } from 'react';
import classNames from 'classnames';

type AlertType = 'success' | 'info' | 'warning' | 'error'

interface AlertProps {
  type?: AlertType;
  message?: string;
  description?: string;
  closable?: boolean;
  afterClose?: () => void;
};

const Alert: FC<AlertProps> = (props) => {
  const {
    type,
    message,
    description,
    closable,
    afterClose
  } = props;

  const rootClasses = classNames(
    'alert',
    {
      [`alert-${type}`]: type
    }
  );

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible && afterClose) {
      afterClose()
    }
  }, [visible, afterClose])


  if (!visible) {
    return null
  }

  return (
    <div className={rootClasses}>
      <div className='alert-content'>
        <div className={classNames({'alert-width-description': Boolean(description)})}>{message}</div>
        <div>{description}</div>
      </div>
      {closable &&
        (<button
          className='alert-close-icon'
          onClick={() => { setVisible(false) }}
        >
          关闭
        </button>)}
    </div>
  )
}

Alert.defaultProps = {
  type: 'info',
  closable: false,
};

export default Alert