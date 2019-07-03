import * as React from 'react';
import block from 'bem-cn';
import { Checkbox, ICheckboxProps } from 'shared/view/elements';

import { WrappedFieldProps } from 'redux-form';

type IProps = ICheckboxProps & WrappedFieldProps;

const b = block('checkbox-field');

class CheckboxField extends React.PureComponent<IProps> {
  public render() {
    const { input, ...restProps } = this.props;
    return (
      <div className={b()}>
        <Checkbox
          {...input}
          {...restProps}
          name={name}
          checked={input.value}
        />
      </div>
    );
  }
}

export { ICheckboxProps as ICheckboxFieldProps, IProps };
export default CheckboxField;
