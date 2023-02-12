import React, { useState } from 'react';
import Button from './components/Button/button';
import Alert from './components/Alert';
import Menu, { MenuMode } from './components/Menu';

const { Item, SubMenu } = Menu;

function App() {
  const [menuMode, setMenuMode] = useState<MenuMode>('horizontal');
  return (
    <div style={{
      margin: '50px'
    }} className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <Button onClick={(e) => console.log(e)}>
          hello
        </Button>
        <Button
          btnType='primary'
          ghost
          size='sm'
        >
          hello
        </Button>
        <Button
          btnType='primary'
          size='lg'
          disabled
        >
          hello
        </Button>
        <Button
          btnType='danger'
        >
          hello
        </Button>
        <Button
          btnType='link'
          href="http://www.baidu.com"
          disabled
        >
          hello
        </Button>
        <hr />
        <Alert 
          type='success'
          message='Success Tips'
          closable={true}
          afterClose={() => {alert('closed')}}
        />
        <Alert 
          message='info Tips'
          description="Additional description and information about copywriting."
          closable={true}
          afterClose={() => {alert('closed')}}
        />
        <Alert 
          type='warning'
          message='info Tips'
        />
        <Alert 
          type='error'
          message='info Tips'
          description="Additional description and information about copywriting."
          closable={true}
          afterClose={() => {alert('closed')}}
        />
        <hr/>
        <Button size='sm' btnType='primary' onClick={() => setMenuMode('horizontal')}>horizontal</Button>
        <Button size='sm' btnType='primary' onClick={() => setMenuMode('vertical')}>vertical</Button>
        <Menu mode={menuMode} onSelect={(index) => console.log(index)}>
          <Item>
            first item
          </Item>
          <Item>
            second item
          </Item>
          <Item disabled>
            third item
          </Item>
          <SubMenu title='subMenu'>
            <Item disabled>
              1 item
            </Item>
            <Item >
              2 item
          </Item>
          </SubMenu>
        </Menu>
      </header>
    </div>
  );
}

export default App;
