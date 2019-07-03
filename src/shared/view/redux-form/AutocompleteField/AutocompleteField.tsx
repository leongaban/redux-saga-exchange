import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { WrappedFieldProps, Omit } from 'redux-form';

import { Autocomplete, IAutocompleteProps } from 'shared/view/elements';

type IProps<T> = Omit<IAutocompleteProps<T>, 'onSelect' | 'selectedOption'>;

const b = block('input-field');

class AutocompleteField<T> extends React.PureComponent<IProps<T> & WrappedFieldProps> {
  public render() {
    const { input, meta: { error, submitFailed }, ...restTextInputProps } = this.props;
    const hasError = submitFailed && Boolean(error);
    return (
      <div className={b()}>
        <Autocomplete<T>
          {...restTextInputProps}
          selectedOption={input.value}
          onSelect={this.handleOnSelect}
          error={hasError && error}
        />
      </div>
    );
  }

  @bind
  private handleOnSelect(option: T) {
    this.props.input.onChange(option);
  }
}

export { IProps as IAutocompleteFieldProps };
export default AutocompleteField;
