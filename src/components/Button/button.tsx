import React, { FC } from 'react';
import classNames from 'classnames';


export type ButtonSize = 'lg' | 'default' | 'sm';

export type ButtonType = 'primary' | 'default' | 'danger' | 'link';

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLElement>
type AnchorButtonProps = React.AnchorHTMLAttributes<HTMLElement>
type BaseButtonProps = Partial<NativeButtonProps & AnchorButtonProps>

export interface ButtonProps extends BaseButtonProps {
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  btnType?: ButtonType;
  ghost?: boolean;
  href?: string;
  children?: React.ReactNode;
}

const Button: FC<ButtonProps> = (props) => {
  const {
    btnType,
    disabled,
    ghost,
    size,
    children,
    href,
    className,
    ...restProps
  } = props;

  const classes = classNames('btn', className, {
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    'disabled': (btnType === 'link') && disabled,
    'ghost': (btnType !== 'link') && ghost,
  });

  if(btnType === 'link' ) {
    return (
      <a
      className={classes}
      href={href}
      {...restProps}
    >
      {children}
    </a>
    )
  } else {
    return (
      <button
        className={classes}
        disabled={disabled}
        {...restProps}
      >
        {children}
      </button>
    )
  }
};

Button.defaultProps = {
  disabled: false,
  btnType: 'default'
}

export default Button;