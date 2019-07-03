import * as React from 'react';
import block from 'bem-cn';

import { Preloader } from 'shared/view/elements';

import Icon from '../Icon/Icon';
import './Button.scss';

const b = block('button');

type DefaultProps = JSX.IntrinsicElements['button'];
type IconKind = 'trash' | 'plus';
type ButtonSize = 'small' | 'medium' | 'large';

interface IProps extends DefaultProps {
  iconKind?: 'trash' | 'plus';
  size?: ButtonSize;
  color?: 'green' | 'red' | 'blue' | 'black-white' | 'text-red' | 'text-blue' | 'text-green';
  isShowPreloader?: boolean;
  textTransform?: 'uppercase' | 'capitalize';
}

const iconSrc: { [kind in IconKind]: string } = {
  trash: require('./images/trash-inline.svg'),
  plus: require('./images/plus-inline.svg'),
};

const preloaderSize: { [kind in ButtonSize]: number } = {
  large: 1.5,
  medium: 1,
  small: 0.5,
};

class Button extends React.PureComponent<IProps> {
  public render() {
    const {
      size = 'medium', color = 'green', textTransform = 'uppercase', isShowPreloader, iconKind, children,
      ...buttonProps
    } = this.props;
    return (
      <button
        className={b({
          size,
          color,
          'text-transform': textTransform,
        })()}
        tabIndex={0}
        {...buttonProps}
      >
        <div className={b('content')()} tabIndex={-1}>
          {
            isShowPreloader
              ? <Preloader isShow size={preloaderSize[size]} type="button" />
              : (
                <React.Fragment>
                  {iconKind && this.renderIcon(iconKind)}
                  {children}
                </React.Fragment>
              )
          }
        </div>
      </button>
    );
  }

  private renderIcon(kind: IconKind) {
    return <Icon className={b('icon', { kind })()} src={iconSrc[kind]} />;
  }
}

export default Button;

export { IProps as IButtonProps };
