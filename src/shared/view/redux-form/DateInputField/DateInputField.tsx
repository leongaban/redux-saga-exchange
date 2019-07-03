import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { WrappedFieldProps, Omit } from 'redux-form';
import { DateInput, IDateInputProps, Error } from 'shared/view/elements';

const b = block('date-input-field');

type IProps = Omit<IDateInputProps, 'onChangeValue'>;

class DateInputField extends React.PureComponent<IProps & WrappedFieldProps> {
  public render() {
    const { input, meta: { error, touched }, ...restProps } = this.props;
    const hasError = touched && Boolean(error);
    return (
      <div className={b()}>
        <DateInput
          {...input}
          {...restProps}
          name={name}
          error={hasError}
          onChangeValue={this.handleOnChange}
        />
        {hasError && <Error>{error}</Error>}
      </div>
    );
  }

  @bind
  private handleOnChange(value: number) {
    this.props.input.onChange(value);
  }
}

export { IProps as IDateInputFieldProps };
export default DateInputField;
