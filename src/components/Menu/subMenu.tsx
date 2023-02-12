import React, { FC, FunctionComponentElement, useContext, useState } from 'react';
import classNames from 'classnames';

import { MenuContext, MenuItemProps } from './index';

export interface SubMenuProps {
  index?: string;
  title: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const judgeIsParent = (parent: string, child: string) => {
  const parentArray = parent.split('-');
  const childArray = child.split('-');
  for(let i = 0; i < parentArray.length; i++) {
    if(parentArray[i] !== childArray[i]) {
      return false;
    }
  }
  return true;
}

const SubMenu: FC<SubMenuProps> = (props) => {
  const { index, title, className, children } = props;
  const {  mode, currentIndex } = useContext(MenuContext);
  const [open, setOpen] = useState(false);

  const classes = classNames(
    'menu-item',
    'subMenu-item',
    className,
    {
      'menu-item-active': judgeIsParent(index || '', currentIndex)
    }
  );

  const handleClick = (e:React.MouseEvent) => {
      e.preventDefault();
      setOpen((p) => !p);
  };

  const clickEvents = mode === 'vertical' ? {
    onClick: handleClick
  } : {}

  const hoverEvents = mode !== 'vertical' ? {
    onMouseEnter: (e: React.MouseEvent) => { handleMouse(e, true)},
    onMouseLeave: (e: React.MouseEvent) => { handleMouse(e, false)}
  } : {}


  let timer: any
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer)
    e.preventDefault()
    timer = setTimeout(() => {
      setOpen(toggle)
    }, 300)
  };

  const renderChildren = () => {
    if(!open) {
      return null 
    }
    const subMenuClasses = classNames('menu-submenu')
    const childrenComponent = React.Children.map(children, (child, childIndex) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>;
      const { displayName } = childElement.type;
      if(displayName === 'MenuItem') {
        return React.cloneElement(childElement, { index: `${index}-${childIndex}`})
      } else {
        console.error('invalid MenuItem in Menu component', childElement)
      }
    })

    return (
      <ul className={subMenuClasses}>
        {childrenComponent}
      </ul>
    )
  }


  return (
    <li
      className={classes}
      {...hoverEvents}
    >
      <div
        className='subMenu-title'
        {...clickEvents}
      >
        {title}
      </div>
      {renderChildren()}
    </li>
  )
}

SubMenu.displayName = 'SubMenu';
export default SubMenu;
