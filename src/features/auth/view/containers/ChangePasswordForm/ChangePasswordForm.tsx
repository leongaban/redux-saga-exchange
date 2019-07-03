import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';

import { Button, Error, InputControl } from 'shared/view/elements';
import { InputField, IInputFieldProps } from 'shared/view/redux-form';
import { required, validatePassword } from 'shared/helpers/validators';
import { isSuccessedByState } from 'shared/helpers/redux';
import { IAppReduxState } from 'shared/types/app';
import { ICommunication } from 'shared/types/redux';

import { actions, reduxFormEntries, selectors } from '../../../redux';
import { AuthLayout } from '../../containers';
import * as NS from '../../../namespace';
import './ChangePasswordForm.scss';

interface IDispatchProps {
  changePassword: typeof actions.changePassword;
}

interface IStateProps {
  changePasswordCommunication: ICommunication;
}

interface IOwnProps {
  resetPasswordToken?: string;
  email?: string;
  onSuccessfullPasswordChange(): void;
}

type IProps = IOwnProps & IStateProps & IDispatchProps & InjectedFormProps<NS.IChangePasswordForm, IOwnProps>;

function mapDispatch(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators({
    changePassword: actions.changePassword,
  }, dispatch);
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    changePasswordCommunication: selectors.selectCommunicationState('changePassword', state),
  };
}

function validatePasswordConfirmation(passwordConfirm: string | undefined, { password }: NS.IChangePasswordForm) {
  return passwordConfirm !== password ? 'Passwords are not equals' : undefined;
}

const b = block('change-password-form');

const { changePasswordFormEntry: { name, fieldNames } } = reduxFormEntries;

const PasswordFieldWrapper = Field as new () => Field<IInputFieldProps>;
const RepeatPasswordFieldWrapper = Field as new () => Field<IInputFieldProps>;

class ChangePasswordForm extends React.PureComponent<IProps> {

  public componentWillReceiveProps(nextProps: IProps) {
    if (isSuccessedByState(this.props.changePasswordCommunication, nextProps.changePasswordCommunication)) {
      this.props.onSuccessfullPasswordChange();
    }
  }

  public render() {
    const { submitting, error } = this.props;
    const isDisabled = submitting;
    return (
      <form onSubmit={this.handleLoginSubmit}>
        <AuthLayout title="CHANGE PASSWORD">
          <div className={b()}>
            <InputControl label="Password">
              <PasswordFieldWrapper
                component={InputField}
                name={fieldNames.password}
                type="Password"
                validate={[required, validatePassword]}
                validateOnChange
                autoFocus
              />
            </InputControl>

            <InputControl label="Repeat password">
              <RepeatPasswordFieldWrapper
                component={InputField}
                name={fieldNames.passwordConfirm}
                type="Password"
                validate={[required, validatePasswordConfirmation]}
                validateOnBlur
              />
            </InputControl>

            <div className={b('error-section')()}>
              {error && <Error withIcon>{error}</Error>}
            </div>

            <div className={b('button')()}>
              <Button disabled={isDisabled}>
                SEND
              </Button>
            </div>

          </div>
        </AuthLayout>
      </form>
    );
  }

  @bind
  private handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    const { handleSubmit, changePassword, resetPasswordToken, email } = this.props;
    handleSubmit((data) => {
      changePassword({ email, resetPasswordToken, password: data.password });
    })(e);
  }
}

export { IProps, ChangePasswordForm, validatePasswordConfirmation };
export default (
  reduxForm<NS.IChangePasswordForm, IOwnProps>({
    form: name,
    touchOnChange: true,
  })(
    connect(mapState, mapDispatch)(
      ChangePasswordForm
    )
  )
);
