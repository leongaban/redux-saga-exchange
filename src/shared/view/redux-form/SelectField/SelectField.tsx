import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { WrappedFieldProps, Omit } from 'redux-form';

import { Select, ISelectProps } from 'shared/view/elements';

type IProps<T> = Omit<ISelectProps<T>, 'onSelect' | 'selectedOption'> ;

const b = block('input-field');

class SelectField<T> extends React.PureComponent<IProps<T> & WrappedFieldProps> {
  public render() {
    const { input, ...restTextInputProps } = this.props;
    return (
      <div className={b()}>
        <Select
          {...input}
          {...restTextInputProps}
          selectedOption={input.value}
          onSelect={this.handleOnSelect}
        />
      </div>
    );
  }

  @bind
  private handleOnSelect(option: T) {
    this.props.input.onChange(option);
  }

}

export { IProps as ISelectFieldProps };
export default SelectField;
