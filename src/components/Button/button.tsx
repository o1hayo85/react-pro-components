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
    'disabled': (btnType === ButtonType.Link) && disabled,
    'ghost': (btnType !== ButtonType.Link) && ghost,
  });

  if(btnType === ButtonType.Link ) {
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
  btnType: ButtonType.Default
}

export default Button;