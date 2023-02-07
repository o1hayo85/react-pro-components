import React from "react";
import { screen, render, fireEvent } from '@testing-library/react'
import Button, { ButtonProps, ButtonSize, ButtonType } from "./button";



describe('test button component', () => {
  test('should render correct default button', () => {
    const buttonProps = {
      onClick: jest.fn()
    }
    render(<Button {...buttonProps}>Nice</Button>)
    const element = screen.getByText('Nice');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toEqual('BUTTON');
    expect(element).toHaveClass('btn btn-default');
    fireEvent.click(element);
    expect(buttonProps.onClick).toHaveBeenCalled();
  })

  test('should render correct component based on different props', () => {
    const testProps:ButtonProps = {
      btnType: ButtonType.Primary,
      size: ButtonSize.Large,
      className: 'btn-test'
    }
    render(<Button {...testProps}>Nice</Button>)
    const element = screen.getByText('Nice');
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('btn btn-lg btn-primary btn-test')
  })

  test('should render a link when btnType equals link and href is provided', () => {
    render(<Button btnType={ButtonType.Link} href="baidu.com">link</Button>)
    const element = screen.getByText('link');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toEqual('A');
    expect(element).toHaveClass('btn btn-link');
  })

  test('should render a disable button when disabled props has been set true', () => {
    const disabledProps:ButtonProps = {
      disabled: true,
      onClick: jest.fn()
    }
    render(<Button {...disabledProps}>disabled button</Button>)
    const element = screen.getByText('disabled button') as HTMLButtonElement;
    expect(element).toBeInTheDocument();
    expect(element).not.toHaveClass('btn disabled')
    expect(element.disabled).toBeTruthy();
    fireEvent.click(element);
    expect(disabledProps.onClick).not.toHaveBeenCalled()
  })
})