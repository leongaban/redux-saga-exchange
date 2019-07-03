import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';

import { required, length } from 'shared/helpers/validators';
import { InputField, IInputFieldProps } from 'shared/view/redux-form';
import { InputControl, Button, Error } from 'shared/view/elements';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { TwoFAType } from 'shared/types/models';

import { reduxFormEntries } from '../../../redux';
import * as NS from '../../../namespace';
import './Toggle2faForm.scss';

interface IOwnProps {
  is2FAEnabled: boolean;
  onCodeSubmit(code: NS.IToggle2faForm): void;
}

type IProps = IOwnProps & ITranslateProps & InjectedFormProps<NS.IToggle2faForm, IOwnProps>;

const { toggle2faFormEntry: { name, fieldNames } } = reduxFormEntries;

const CodeFieldWrapper = Field as new () => Field<IInputFieldProps>;

const b = block('toggle-2fa-form');

const validateByLength6 = length(6);

class Toggle2faForm extends React.PureComponent<IProps> {

  public render() {
    const { translate: t, is2FAEnabled, error } = this.props;
    return (
      <form className={b()} onSubmit={this.handleFormSubmit}>
        <InputControl label={this.getInputLabel(is2FAEnabled)}>
          <CodeFieldWrapper
            component={InputField}
            name={fieldNames.code}
            placeholder={t('TWO-FA-PROVIDER:TOGGLE-2FA-FORM:CODE-INPUT-PLACEHOLDER')}
            translate={t}
            validateOnChange
            validate={[required, validateByLength6]}
          />
        </InputControl>
        <InputControl label={this.getInputLabel(!is2FAEnabled)}>
          <CodeFieldWrapper
            component={InputField}
            name={fieldNames.new2FaProviderCode}
            placeholder={t('TWO-FA-PROVIDER:TOGGLE-2FA-FORM:CODE-INPUT-PLACEHOLDER')}
            translate={t}
            validateOnChange
            validate={[required, validateByLength6]}
          />
        </InputControl>
        {error && (
          <div className={b('error')()}>
            <Error withIcon>
              {error}
            </Error>
          </div>
        )}
        <div className={b('row')()}>
          <div className={b('button')()}>
            <Button color="blue">
              {t('SHARED:BUTTONS:SUBMIT')}
            </Button>
          </div>
        </div>
      </form>
    );
  }

  @bind
  private getInputLabel(isNewCodeInput: boolean) {
    const { translate: t } = this.props;
    const provider: TwoFAType = isNewCodeInput ? 'Authenticator' : 'Email';
    return t('TWO-FA-PROVIDER:TOGGLE-2FA-FORM:CODE-INPUT-LABEL', { provider });
  }

  @bind
  private handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    const { handleSubmit, onCodeSubmit } = this.props;
    handleSubmit((data) => {
      onCodeSubmit(data);
    })(e);
  }
}

export { Toggle2faForm };
export default (
  reduxForm<NS.IToggle2faForm, IOwnProps>({ form: name })(
    i18nConnect(
      Toggle2faForm
    )
  )
);
