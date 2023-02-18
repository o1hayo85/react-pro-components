import React from 'react';
import './index.less';

export interface ButtonProps {
  children: React.ReactNode
}
const Button:React.FC<ButtonProps> = (props) => {
  const { children } = props;
  return (
    <button className='mini-button'>
      {children}
    </button>
  )
}

export default Button;
