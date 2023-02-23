import React from 'react';
import classnames from 'classnames';

import SpaceItem from './item';
import './index.less';

type SizeType = 'small' | 'middle' | 'large' | undefined;

export type SpaceSize = SizeType | number;

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: React.CSSProperties;
  size?: SpaceSize | [SpaceSize, SpaceSize];
  direction?: 'horizontal' | 'vertical';
  align?: 'start' | 'end' | 'center' | 'baseline';
  split?: React.ReactNode;
  wrap?: boolean;
}

export const SpaceContext = React.createContext({
  latestIndex: 0,
  horizontalSize: 0,
  verticalSize: 0,
  supportFlexGap: false,
});

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};

const getNumberSize = (size: SpaceSize) => {
  return typeof size === 'string' ? spaceSize[size] : size || 0
}

const Space: React.FC<SpaceProps> = (props) => {
  const {
    className,
    style,
    size = 'small',
    direction = 'horizontal',
    align,
    wrap,
    split,
    children,
    ...otherProps
  } = props;

  const supportFlexGap = true;

  const alignMerged = align === undefined && direction === 'horizontal' ? 'center' : align;

  const cn = classnames(
    'mini-space',
    `mini-space-${direction}`,
    {
      className,
      [`mini-space-align-${alignMerged}`]: alignMerged
    }
  );

  const gapStyle: React.CSSProperties = {};

  let latestIndex = 0;
  const nodes = React.Children.map(children, (c, i) => {
    const child = c as React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    if (child !== null && child !== undefined) {
      latestIndex = i
    }

    const key = (child && child.key) || `item-${i}`;

    return (
      <SpaceItem
        key={key}
        className='mini-space-item'
        index={i}
        direction={direction}
        marginDirection={'marginLeft'}
        split={split}
        wrap={wrap}
      >
        {child}
      </SpaceItem>
    )
  })

  const [horizontalSize, verticalSize] = React.useMemo(() => {
    return (Array.isArray(size) ? size : [size, size]).map((el) => getNumberSize(el));
  }, [size]);

  const spaceContextValue = React.useMemo(() => ({
    horizontalSize,
    verticalSize,
    latestIndex,
    supportFlexGap
  }), [])

  if (!children) {
    return null
  }

  if (wrap) {
    gapStyle.flexWrap = 'wrap'
  }

  if (supportFlexGap) {
    gapStyle.columnGap = horizontalSize;
    gapStyle.rowGap = verticalSize;
  }

  return (
    <div
      className={cn}
      style={{
        ...style,
        ...gapStyle
      }}
      {...otherProps}
    >
      <SpaceContext.Provider value={spaceContextValue}>
        {nodes}
      </SpaceContext.Provider>
    </div>
  )
}

export default Space;