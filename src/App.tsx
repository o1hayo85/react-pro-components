import React from 'react';
import Button, { ButtonSize, ButtonType } from './components/Button/button';
import Alert from './components/Alert';
import Menu from './components/Menu';

const { Item } = Menu;

function App() {
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
          btnType={ButtonType.Primary}
          ghost
          size={ButtonSize.Small}
        >
          hello
        </Button>
        <Button
          btnType={ButtonType.Primary}
          size={ButtonSize.Large}
          disabled
        >
          hello
        </Button>
        <Button
          btnType={ButtonType.Danger}
        >
          hello
        </Button>
        <Button
          btnType={ButtonType.Link}
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
        <Menu onSelect={(index) => alert(index)}>
          <Item>
            first item
          </Item>
          <Item>
            second item
          </Item>
          <Item disabled>
            third item
          </Item>
        </Menu>
      </header>
    </div>
  );
}

export default App;
