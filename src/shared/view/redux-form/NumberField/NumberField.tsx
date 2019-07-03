import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { WrappedFieldProps, Omit } from 'redux-form';

import { NumberInput, INumberInputProps, Error } from 'shared/view/elements';

type IProps =  Omit<INumberInputProps, 'onChange' | 'value'>;

const b = block('number-field');

class NumberField extends React.PureComponent<IProps & WrappedFieldProps> {
  public render() {
    const {
      meta: {
        error,
        submitFailed,
      },
      input,
      ...restProps
    } = this.props;
    const hasError = submitFailed && error;
    return (
      <div className={b()}>
        <NumberInput
          {...restProps}
          value={input.value}
          error={hasError}
          onChange={this.handleInputChange}
        />
        {hasError && <Error>{error}</Error>}
      </div>
    );
  }

  @bind
  private handleInputChange(value: string) {
    this.props.input.onChange(value);
  }
}

export { IProps as INumberFieldProps };
export default NumberField;
