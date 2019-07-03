import * as React from 'react';
import block from 'bem-cn';
import { Input, IInputProps, Error } from 'shared/view/elements';
import { TranslateFunction } from 'services/i18n/namespace';

import { WrappedFieldProps } from 'redux-form';

interface IProps extends IInputProps {
  translate?: TranslateFunction; // TODO make this field required!
  hasIcon?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

const b = block('input-field');

class InputField extends React.PureComponent<IProps & WrappedFieldProps> {
  public render() {
    const {
      input,
      meta: {
        error,
        submitFailed,
        touched,
        asyncValidating,
        active,
      },
      hasIcon,
      validateOnChange,
      validateOnBlur,
      ...restTextInputProps
    } = this.props;
    const hasError = touched && (validateOnChange || submitFailed || !active && validateOnBlur) && Boolean(error);
    return (
      <div className={b()}>
        <Input
          {...input}
          {...restTextInputProps}
          error={hasError}
          name={name}
          isLoading={asyncValidating}
          hasIcon={hasIcon}
        />
        {hasError && <Error>{error}</Error>}
      </div>
    );
  }
}

export { IProps as IInputFieldProps };
export default InputField;
