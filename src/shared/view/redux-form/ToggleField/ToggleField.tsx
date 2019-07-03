import * as React from 'react';
import block from 'bem-cn';
// import { bind } from 'decko';

import { Toggle, IToggleProps } from 'shared/view/elements';

import { WrappedFieldProps } from 'redux-form';

type IProps = IToggleProps & WrappedFieldProps;

const b = block('toggle-field');

class ToggleField extends React.PureComponent<IProps> {
  public render() {
    const { input, ...restProps } = this.props;
    return (
      <div className={b()}>
        <Toggle
          {...input}
          {...restProps}
          name={name}
          checked={input.value}
        />
      </div>
    );
  }
}

export { IToggleProps as IToggleFieldProps, IProps };
export default ToggleField;
