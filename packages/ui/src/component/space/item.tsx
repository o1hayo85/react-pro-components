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
  const { latestIndex, verticalSize, horizontalSize, supportFlexGap } = React.useContext(SpaceContext);

  const { 
    className,
    children,
    index,
    direction,
    marginDirection,
    split,
    wrap
   } = props;

  let style: React.CSSProperties = {};

  if(!supportFlexGap) {
    if(direction === 'vertical') {
      if(index < latestIndex) {
        style = { marginBottom: horizontalSize / (split ? 2 : 1) }
      }
    } else {
      style = {
        ...(index < latestIndex && { [marginDirection]: horizontalSize / (split ? 2 : 1) }),
        ...(wrap && { paddingBottom: verticalSize })
      }
    }
  }
   

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