import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { Field, reduxForm, InjectedFormProps, FormErrors, getFormValues } from 'redux-form';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';

import { ICommunication } from 'shared/types/redux';
import { IAppReduxState } from 'shared/types/app';
import { Button, InputControl, Error, Link } from 'shared/view/elements';
import { InputField, CaptchaField, IInputFieldProps, ICaptchaFieldProps } from 'shared/view/redux-form';
import { validateEmail, required, validatePassword, maxLength } from 'shared/helpers/validators';

import { actions, reduxFormEntries, selectors } from '../../../redux';
import { DUPLICATE_EMAIL_ERROR_CODE } from '../../../constants';
import * as NS from '../../../namespace';

import './RegistrationForm.scss';

interface IDispatchProps {
  register: typeof actions.register;
}

interface IOwnProps {
  redirectToPasswordRecovery?(): void;
  onRegisterSuccess(): void;
}

interface IStateProps {
  registerCommunication: ICommunication;
  formValues: Partial<NS.IRegistrationForm>;
}

type IFormProps = InjectedFormProps<NS.IRegistrationForm, IOwnProps> & IOwnProps;

type IProps = IStateProps & IDispatchProps & IFormProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    registerCommunication: selectors.selectCommunicationState('register', state),
    formValues: getFormValues(name)(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators({
    register: actions.register,
  }, dispatch);
}

const b = block('registration-form');

const { registrationFormEntry: { name, fieldNames } } = reduxFormEntries;

const EmailFieldWrapper = Field as new () => Field<IInputFieldProps>;
const PasswordFieldWrapper = Field as new () => Field<IInputFieldProps>;
const PasswordConfirmFieldWrapper = Field as new () => Field<IInputFieldProps>;
const NickameFieldWrapper = Field as new () => Field<IInputFieldProps>;
const CaptchaFieldWrapper = Field as new () => Field<ICaptchaFieldProps>;

function validatePasswordConfirmation(passwordConfirm: string | undefined, { password }: NS.IRegistrationForm) {
  return passwordConfirm !== password ? 'Passwords are not equal' : undefined;
}
const validateNicknameMaxLength = maxLength(25);

class RegistrationForm extends React.PureComponent<IProps> {

  public componentDidUpdate(prevProps: IProps) {
    const { registerCommunication: { isRequesting: prevIsRequesting } } = prevProps;
    const { registerCommunication: { isRequesting, error }, onRegisterSuccess } = this.props;
    const isRegisterSuccess = prevIsRequesting && !isRequesting && !error.length;
    if (isRegisterSuccess) {
      onRegisterSuccess();
    }
  }

  public render() {
    const { error, registerCommunication: { isRequesting } } = this.props;
    return (
      <form onSubmit={this.handleLoginSubmit} noValidate>
        <div className={b()}>
          <InputControl label="Email">
            <EmailFieldWrapper
              component={InputField}
              name={fieldNames.email}
              type="email"
              validate={[required, validateEmail]}
              validateOnBlur
              autoFocus
            />
            {error === DUPLICATE_EMAIL_ERROR_CODE && this.renderEmailDuplicationError()}
          </InputControl>
          <InputControl label="Password">
            <PasswordFieldWrapper
              component={InputField}
              name={fieldNames.password}
              type="Password"
              validate={[required, validatePassword]}
              validateOnChange
            />
          </InputControl>
          <InputControl label="Repeat Password">
            <PasswordConfirmFieldWrapper
              component={InputField}
              name={fieldNames.passwordConfirm}
              type="Password"
              validate={[required, validatePasswordConfirmation]}
              validateOnBlur
            />
          </InputControl>
          <InputControl label="Nickname">
            <NickameFieldWrapper
              component={InputField}
              name={fieldNames.nickname}
              validateOnBlur
              validate={[required, validateNicknameMaxLength]}
            />
          </InputControl>
          <div className={b('captcha')()}>
            <CaptchaFieldWrapper
              component={CaptchaField}
              name={fieldNames.captcha}
              validate={[required]}
            />
          </div>
          <div className={b('footer')()}>
            {error && error !== DUPLICATE_EMAIL_ERROR_CODE && <Error withIcon>{error}</Error>}
            <div className={b('button')()}>
              <Button disabled={isRequesting} isShowPreloader={isRequesting}>
                CREATE ACCOUNT
              </Button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  @bind
  private renderEmailDuplicationError() {
    const { formValues, redirectToPasswordRecovery } = this.props;
    return formValues && formValues.email && (
      <Error>
        <>
          Email “{formValues.email}” is already taken.
          <br />
          <Link onClick={redirectToPasswordRecovery}>Forgot password</Link> ?
        </>
      </Error>
    );
  }

  @bind
  private handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    const { handleSubmit, register } = this.props;
    handleSubmit((data) => {
      // Append '; ' to make finding cookie jar easier via split
      const foundCookieSnippet = `; ${document.cookie}`.split('; tioCookieJar=')[1];
      let tioCookieJarString: string = '';
      if (foundCookieSnippet) {
        // tioCookieJar cookie is Base64 encoded JSON string
        tioCookieJarString = atob(
          foundCookieSnippet.split(';')[0]
        );
      }
      if (tioCookieJarString && tioCookieJarString !== '') {
        // Try-Catch block in case cookie jar ends up corrupt instead of valid JSON
        try {
          data.referralId = JSON.parse(tioCookieJarString).affiliateId;
        } catch (e) {
          // Do Nothing
        }
      }
      const registerPayload = { ...data, queryStringForUtm: window.location.search };
      register(registerPayload);
    })(e);
  }
}

const container = connect<IStateProps, IDispatchProps, IOwnProps>(mapState, mapDispatch)(RegistrationForm);
const formed = reduxForm<NS.IRegistrationForm, IOwnProps>({
  form: name,
  touchOnChange: true,
  asyncValidate: (values, dispatch, props, blurredField) => {
    // tslint:disable-next-line:max-line-length
    const { asyncErrors } = props as IFormProps & { asyncErrors: FormErrors<NS.IRegistrationForm> };
    return new Promise((resolve, reject) => {
      switch (blurredField as keyof NS.IRegistrationForm) {
        case 'nickname':
          dispatch(actions.validateNickname({
            value: values.nickname,
            onValidationSuccess: () => {
              resolve({ ...asyncErrors });
            },
            onValidationFail: () => {
              reject({ ...asyncErrors, nickname: `Nickname “${values.nickname}” is already taken` });
            },
          }));
          break;
        default:
          resolve();
          break;
      }
    });
  },
  asyncBlurFields: [fieldNames.nickname],
})(container);

export { IProps, RegistrationForm, validatePasswordConfirmation };
export default formed;
