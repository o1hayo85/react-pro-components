import React, { FC, CSSProperties, ReactNode, useContext } from 'react';
import classNames from 'classnames';

import { MenuContext } from './menu';

export interface MenuItemProps {
  index?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const MenuItem: FC<MenuItemProps> = (props) => {
  const {
    index,
    disabled,
    className,
    style,
    children
  } = props;

  const {
    currentIndex,
    onSelect
  } = useContext(MenuContext);

  const classes = classNames(
    'menu-item',
    className,
    {
      'menu-item-disabled': disabled,
      'menu-item-active': index === currentIndex
    }
  );

  const click = () => {
    if(onSelect && !disabled && (typeof index === 'string')) {
      onSelect(index);
    }
  }

  return (
    <li
      className={classes}
      style={style}
      onClick={click}
    >
      {children}
    </li>
  )
}

MenuItem.defaultProps = {};
MenuItem.displayName = 'MenuItem';

export default MenuItem;