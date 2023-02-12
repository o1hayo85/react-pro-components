import React, { FC, createContext, useState } from 'react';
import classNames from 'classnames';

import { MenuItemProps } from './menuItem';

export type MenuMode = 'horizontal' | 'vertical';
export interface MenuProps {
  defaultIndex?: string;
  className?: string;
  mode?: MenuMode;
  style?: React.CSSProperties;
  onSelect?: (selectedIndex: string) => void;
  children: React.ReactNode;
};

export interface IMenuContext {
  currentIndex: string;
  mode?: MenuMode;
  onSelect?: (selectedIndex: string) => void;
}

export const MenuContext = createContext<IMenuContext>({
  currentIndex: '0'
})


const Menu: FC<MenuProps> = (props) => {
  const {
    className,
    mode,
    style,
    children,
    defaultIndex,
    onSelect
  } = props;

  const [currentActive, setCurrentActive] = useState(defaultIndex);

  const rootClasses = classNames(
    'menu',
    className,
    {
      'menu-vertical': mode === 'vertical',
      'menu-horizontal': mode === 'horizontal',
    }
  );

  const onClickItem = (index: string) => {
    setCurrentActive(index);
    if(onSelect) {
      onSelect(index);
    }
  }

  const menuContext:IMenuContext = {
    currentIndex: currentActive ? currentActive : '0',
    mode,
    onSelect:onClickItem
  }

  const renderChildren = () => {
    if(!children) {
      console.warn('useless Menu component')
      return null;
    }
    return React.Children.map(children, (child, index) => {
      const childElement = child as React.FunctionComponentElement<MenuItemProps>;
      const { displayName } = childElement.type;
      if(displayName === 'MenuItem' || displayName === 'SubMenu') {
        return React.cloneElement(childElement, { index:  index.toString()})
      } else {
        console.error('invalid MenuItem in Menu component', childElement)
      }
    })
  }

  return (
    <MenuContext.Provider value={menuContext}>
      <ul className={rootClasses} style={style}>
        {renderChildren()}
      </ul>
    </MenuContext.Provider>
  )
}

Menu.defaultProps = {
  mode: 'horizontal'
};

export default Menu;
