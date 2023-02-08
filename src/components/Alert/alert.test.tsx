import React from 'react';
import Alert, { AlertProps } from './alert';
import { screen, render, fireEvent } from '@testing-library/react';

describe('test alert component', () => {
  test('should render the correct alert component', () => {
    render(<Alert type='info' message='default alert'/>);
    const element = screen.getByRole('alert') as HTMLElement & AlertProps;
    const alertContent = screen.getByTestId('alert-content');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toEqual('DIV');
    expect(element).toHaveClass('alert alert-info');
    expect(element.closable).toBeFalsy();
    expect(alertContent.childNodes.length).toBe(1);
  })

  test('should render the correct alert based on different type props', () => {
    const alertProps:AlertProps = {
      type: 'error',
      message: 'error message',
      description: 'error message test'
    }
    render(<Alert {...alertProps}/>);
    const element = screen.getByRole('alert') as HTMLElement & AlertProps;
    const alertContent = screen.getByTestId('alert-content');
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('alert alert-error')
    expect(alertContent.childNodes.length).toBe(2);
  })

  test('the alert component dismiss and implement afterClose function when click the close button', () => {
    const alertProps:AlertProps = {
      closable: true,
      afterClose: jest.fn()
    }
    render(<Alert {...alertProps}/>);
    const element = screen.getByRole('alert') as HTMLElement & AlertProps;
    const closeBtn = screen.getByText('关闭');
    expect(element).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(element).not.toBeInTheDocument()
    expect(alertProps.afterClose).toHaveBeenCalled()
  })
})
