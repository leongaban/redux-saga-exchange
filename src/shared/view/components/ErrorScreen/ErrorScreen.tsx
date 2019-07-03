import React from 'react';
import block from 'bem-cn';

import { Icon, Button } from 'shared/view/elements';
import './ErrorScreen.scss';

interface IProps {
  title: string;
  message: string;
  withIcon?: boolean;
  buttonName?: string;
  onButtonClick?(): void;
}

const b = block('error-screen');

class ErrorWindow extends React.Component<IProps> {
  public render() {
    const { title, message, withIcon = false, buttonName = 'REPEAT', onButtonClick} = this.props;
    return (
      <div className={b()}>
        {withIcon && <Icon src={require('./img/error-inline.svg')} className={b('icon')()}/>}
        <div className={b('title')()}>
          {title}
        </div>
        <div className={b('message')()}>
          {message}
        </div>
        {onButtonClick &&
          <div className={b('button')()}>
            <Button size="large" onClick={onButtonClick}>
              {buttonName}
            </Button>
          </div>}
      </div>
    );
  }
}

export default ErrorWindow;
