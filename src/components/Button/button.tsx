import React, { FC } from 'react';
import classNames from 'classnames';

export enum ButtonSize {
  Large = 'lg',
  Small = 'sm',
}

export enum ButtonType {
  Primary = 'primary',
  Default = 'default',
  Danger = 'danger',
  Link = 'link'
}

export interface ButtonProps {
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  btnType?: ButtonType;
  href?: string;
  children: React.ReactNode;
}

const Button: FC<ButtonProps> = (props) => {
  const {
    btnType,
    disabled,
    size,
    children,
    href,
    className,
  } = props;

  const classes = classNames('btn', {
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    'disabled': (btnType === ButtonType.Link) && disabled,
    [`${className}`]: className,
  });

  if(btnType === ButtonType.Link ) {
    return (
      <a
      className={classes}
      href={href}
    >
      {children}
    </a>
    )
  } else {
    return (
      <button
        className={classes}
        disabled={disabled}
      >
        {children}
      </button>
    )
  }
};

Button.defaultProps = {
  disabled: false,
  btnType: ButtonType.Default
}

export default Button;