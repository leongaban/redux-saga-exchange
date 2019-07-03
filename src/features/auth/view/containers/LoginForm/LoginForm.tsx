import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';

import { IAppReduxState } from 'shared/types/app';
import { Link, Button, Error, InputControl } from 'shared/view/elements';
import {
  InputField, IInputFieldProps, CheckboxField,
  ICheckboxFieldProps,
} from 'shared/view/redux-form';
import { validateEmail, required } from 'shared/helpers/validators';
import { isSuccessedByState } from 'shared/helpers/redux';
import { ICommunication } from 'shared/types/redux';
import { selectors as userSelectors } from 'services/user/redux';

import { actions, reduxFormEntries, selectors } from '../../../redux';
import * as NS from '../../../namespace';
import './LoginForm.scss';
import qs from 'query-string';

interface IDispatchProps {
  login: typeof actions.login;
}

interface IOwnProps {
  isAdminPanel: boolean;
  passwordRecoveryPath?: string;
  onSuccessfulLogin(): void;
}

interface IStateProps {
  isLoginFetching: ICommunication;
  isRestoreSessionRequesting: boolean;
}

type IProps = IStateProps & IOwnProps & IDispatchProps & InjectedFormProps<NS.ILoginForm, IOwnProps>;

function mapState(state: IAppReduxState): IStateProps {
  return {
    isLoginFetching: selectors.selectCommunicationState('login', state),
    isRestoreSessionRequesting: userSelectors.selectSessionRestoring(state).isRequesting,
  };
}

function mapDispatch(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators({
    login: actions.login,
  }, dispatch);
}

const b = block('login-form');

const { loginFormEntry: { name, fieldNames } } = reduxFormEntries;

const EmailFieldWrapper = Field as new () => Field<IInputFieldProps>;
const PasswordFieldWrapper = Field as new () => Field<IInputFieldProps>;
const RememberMeFieldWrapper = Field as new () => Field<ICheckboxFieldProps>;

class LoginForm extends React.PureComponent<IProps> {
  public componentWillMount() {
    this.props.initialize({
      email: document.referrer.includes('welcome.trd.io') ? qs.parse(location.search).email : ''
    });
  }

  public componentWillReceiveProps(nextProps: IProps) {
    const { isLoginFetching } = this.props;
    const { isLoginFetching: nextIsLoginFetching } = nextProps;
    if (isSuccessedByState(isLoginFetching, nextIsLoginFetching)) {
      this.props.onSuccessfulLogin();
    }
  }

  public render() {
    const {
      error, isRestoreSessionRequesting,
      isLoginFetching: { isRequesting }, passwordRecoveryPath,
    } = this.props;
    return (
      <form onSubmit={this.handleLoginSubmit} noValidate>
        <div className={b()}>
          <InputControl label="Email">
            <EmailFieldWrapper
              component={InputField}
              name={fieldNames.email}
              type="email"
              validate={[required, validateEmail]}
              autoFocus
              disabled={isRestoreSessionRequesting}
            />
          </InputControl>
          <InputControl label="Password">
            <PasswordFieldWrapper
              component={InputField}
              name={fieldNames.password}
              type="Password"
              validate={[required]}
              disabled={isRestoreSessionRequesting}
            />
          </InputControl>
          <div className={b('section')()}>
            <RememberMeFieldWrapper
              component={CheckboxField}
              name={fieldNames.remember}
              label="Remember me"
            />
            {
              passwordRecoveryPath && (
                <Link className={b('forgot-pass-link')()} href={passwordRecoveryPath}>
                  I forgot my password
                </Link>
              )
            }
          </div>

          <div className={b('error-section')()}>
            {error && <Error withIcon>{error}</Error>}
          </div>

          <div className={b('button')()}>
            <Button disabled={isRequesting} isShowPreloader={isRequesting}>
              LOG IN
            </Button>
          </div>

        </div>
      </form>
    );
  }

  @bind
  private handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    const { handleSubmit, login, isAdminPanel } = this.props;
    handleSubmit((data) => {
      login({ ...data, isAdminPanel });
    })(e);
  }
}

const container = connect<IStateProps, IDispatchProps, IOwnProps>(mapState, mapDispatch)(LoginForm);
const formed = reduxForm<NS.ILoginForm, IOwnProps>({ form: name })(container);

export { IProps, LoginForm, b as componentClassName };
export default formed;
