import React, { ReactNode } from 'react';
import Frame from '../frame';
import { Props } from '../interface';
import Content from './content';

export const FindPassword: React.FC = (props: Props) => {
  return (
    <Frame {...props}>
      <Content/>
    </Frame>
  );
};
