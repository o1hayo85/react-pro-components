import React from 'react';
import Button, { ButtonSize, ButtonType } from './components/Button/button';

function App() {
  return (
    <div className="App">
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
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
