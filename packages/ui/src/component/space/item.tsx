import React from 'react';
import { SpaceContext } from '.';

export interface SpaceItemProps {
  className?: string;
  index?: number;
  direction?: 'horizontal' | 'vertical';
  marginDirection?: 'marginLeft' | 'marginRight';
  split?: string | React.ReactNode;
  wrap?: boolean;
  children?: React.ReactNode
}

const Item:React.FC<SpaceItemProps> = (props) => {
  const { latestIndex } = React.useContext(SpaceContext);

  const { 
    className,
    children,
    index,
    // direction,
    // marginDirection,
    split,
    // wrap
   } = props;

  const style: React.CSSProperties = {};
   

  return (
    <React.Fragment>
      <div className={className} style={{...style}}>
        {children}
      </div>
      {index < latestIndex && split && (
        <span className={`${className}-split`}>
          {split}
        </span>
      )}
    </React.Fragment>
      
  )
}

export default Item;