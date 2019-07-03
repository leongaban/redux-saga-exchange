import block from 'bem-cn';
import * as React from 'react';

import './InputControl.scss';

const b = block('input-control');

interface IProps {
  label?: string | JSX.Element;
}

class InputControl extends React.PureComponent<IProps> {

  public render() {
    const { children, label } = this.props;

    return (
      <div className={b()}>
        {label && <label className={b('label')()}>{label}</label>}
        {children}
      </div>
    );
  }
}

export default InputControl;
