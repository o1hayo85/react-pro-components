import React from 'react';
import Frame from '../frame';
import { Props } from '../interface';
import Content from './content';

export const Registry: React.FC = (props: Props) => {
  console.log('findpas...r', props);
  return (
    <Frame {...props}>
      <Content/>
    </Frame>
  );
};
