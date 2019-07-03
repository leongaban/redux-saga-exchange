import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';

import { IAppReduxState } from 'shared/types/app';
import { Button, Error, InputControl } from 'shared/view/elements';
import { InputField, IInputFieldProps, CaptchaField, ICaptchaFieldProps } from 'shared/view/redux-form';
import { validateEmail, required } from 'shared/helpers/validators';
import { isSuccessedByState } from 'shared/helpers/redux';
import { ICommunication } from 'shared/types/redux';

import { actions, reduxFormEntries, selectors } from '../../../redux';
import * as NS from '../../../namespace';
import './PasswordRecoveryForm.scss';

interface IDispatchProps {
  resetPassword: typeof actions.resetPassword;
}

interface IStateProps {
  isResetPassFetching: ICommunication;
}

interface IState {
  isSucceeded: boolean;
}

type IProps = IStateProps & IDispatchProps & InjectedFormProps<NS.IPasswordRecoveryForm, {}>;

function mapState(state: IAppReduxState): IStateProps {
  return {
    isResetPassFetching: selectors.selectCommunicationState('resetPassword', state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators({
    resetPassword: actions.resetPassword,
  }, dispatch);
}

const b = block('password-recovery-form');

const { passwordRecoveryFormEntry: { name, fieldNames } } = reduxFormEntries;

const EmailFieldWrapper = Field as new () => Field<IInputFieldProps>;
const CaptchaFieldWrapper = Field as new () => Field<ICaptchaFieldProps>;

class PasswordRecoveryForm extends React.PureComponent<IProps, IState> {

  public state: IState = { isSucceeded: false };

  public componentWillReceiveProps({ isResetPassFetching }: IProps) {
    if (isSuccessedByState(this.props.isResetPassFetching, isResetPassFetching)) {
      this.setState(() => ({ isSucceeded: true }));
    }
  }

  public render() {
    const { submitting, error } = this.props;
    const { isSucceeded } = this.state;
    const isDisabled = submitting;
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
            />
          </InputControl>

          <div className={b('captcha')()}>
            <CaptchaFieldWrapper
              component={CaptchaField}
              name={fieldNames.captcha}
              validate={[required]}
            />
          </div>

          {!isSucceeded && (
            <div className={b('error-section')()}>
              {error && <Error withIcon>{error}</Error>}
            </div>
          )}

          <div className={b('button')()}>
            <Button disabled={isDisabled}>
              SEND
            </Button>
          </div>

        </div>
      </form>
    );
  }

  @bind
  private handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    const { handleSubmit, resetPassword } = this.props;
    handleSubmit((data) => {
      resetPassword(data);
    })(e);
  }
}

const container = connect(mapState, mapDispatch)(PasswordRecoveryForm);
const formed = reduxForm<NS.IPasswordRecoveryForm, {}>({ form: name })(container);

export { IProps, PasswordRecoveryForm };
export default formed;
