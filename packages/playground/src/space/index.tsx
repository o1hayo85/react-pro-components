import React from 'react';
import { Space, Button } from 'mini-component-ui';

const SpaceDemo:React.FC<unknown> = () => {
  return (
    <Space
      size="middle"
      direction='horizontal'
      align='center'
      split="|"
    >
      <Button>测试1</Button>
      <Button>测试2</Button>
    </Space>
  )
}

export default SpaceDemo;