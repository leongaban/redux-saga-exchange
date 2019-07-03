import * as React from 'react';
import block from 'bem-cn';
import { Icon } from 'shared/view/elements';
import './Error.scss';

interface IProps {
  children: React.ReactChild;
  withIcon?: boolean;
}

const b = block('error');

function Error({ children, withIcon }: IProps) {
  return (
    <div className={b()}>
      {withIcon && <Icon className={b('icon')()} src={require('./images/error-inline.svg')}/>}
      <span className={b('text')()}>{children}</span>
    </div>
  );
}

export { IProps };
export default Error;
