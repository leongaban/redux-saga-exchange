import * as React from 'react';
import block from 'bem-cn';
import { WrappedFieldProps, Omit } from 'redux-form';

import { Captcha, ICaptchaProps } from 'shared/view/components';

type IProps = Omit<ICaptchaProps, 'onChange'>;

const b = block('checkbox-field');

class CaptchaField extends React.PureComponent<IProps & WrappedFieldProps> {
  public render() {
    const { input } = this.props;

    return (
      <div className={b()}>
        <Captcha
          {...input}
        />
      </div>
    );
  }
}

export { IProps as ICaptchaFieldProps };
export default CaptchaField;
