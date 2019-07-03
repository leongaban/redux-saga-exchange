import * as React from 'react';
import { bind } from 'decko';
import block from 'bem-cn';
import { Radio, IRadioProps } from 'shared/view/elements';

import { WrappedFieldProps } from 'redux-form';

type IProps = IRadioProps & WrappedFieldProps;

const b = block('radio-field');

class RadioField extends React.PureComponent<IProps> {
  public render() {
    const { input, radioValue, ...restProps } = this.props;

    return (
      <div className={b()}>
        <Radio
          {...input}
          {...restProps}
          checked={input.value === radioValue}
          name={name}
          onChange={this.handleRadioChange}
        />
      </div>
    );
  }

  @bind
  private handleRadioChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.input.onChange(this.props.radioValue);
  }
}

export { IRadioProps as IRadioFieldProps, IProps };
export default RadioField;
