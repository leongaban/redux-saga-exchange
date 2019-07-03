import React from 'react';
import { InjectedFormProps, Field, reduxForm } from 'redux-form';
import { bind } from 'decko';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as block from 'bem-cn';

import { InputField, IInputFieldProps } from 'shared/view/redux-form';
import { IAppReduxState } from 'shared/types/app';
import { Button, InputControl } from 'shared/view/elements';
import { TwoFAType } from 'shared/types/models';
import { selectors as userSelectors } from 'services/user';
import { selectors as configSelectors } from 'services/config';
import { ICommunication } from 'shared/types/redux';
import { ClientDeviceType } from 'shared/types/ui';

import * as NS from '../../../namespace';
import { reduxFormEntries, actions, selectors } from '../../../redux';
import { AuthLayout, MAuthLayout } from '../../containers';

import './TwoFactorForm.scss';

const { twoFactorFormEntry: { name, fieldNames } } = reduxFormEntries;

interface IStateProps {
  provider: TwoFAType;
  send2faCommunication: ICommunication;
  isRestoreSessionRequesting: boolean;
  clientDeviceType: ClientDeviceType;
}

interface IDispatchProps {
  sendTwoFactorData: typeof actions.sendTwoFactorData;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    provider: selectors.selectTwoFactor(state).provider,
    send2faCommunication: selectors.selectCommunicationState('sendTwoFactorVerificationData', state),
    isRestoreSessionRequesting: userSelectors.selectSessionRestoring(state).isRequesting,
    clientDeviceType: configSelectors.selectClientDeviceType(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators({
    sendTwoFactorData: actions.sendTwoFactorData,
  }, dispatch);
}

type IProps = IStateProps & IDispatchProps & InjectedFormProps<NS.ITwoFactorForm>;

const b = block('two-factor-auth-form');

const CodeFieldWrapper = Field as new () => Field<IInputFieldProps>;

class TwoFactorForm extends React.PureComponent<IProps> {
  public render() {
    const {
      provider, send2faCommunication: { isRequesting }, isRestoreSessionRequesting, clientDeviceType,
    } = this.props;
    const isBtnDisabled = isRequesting || isRestoreSessionRequesting;
    const Layout = clientDeviceType === 'mobile' ? MAuthLayout : AuthLayout;
    return (
      <Layout>
        <form onSubmit={this.handleFormSubmit} className={b()}>
          <InputControl label={`Enter verification code from ${provider}`}>
            <CodeFieldWrapper
              component={InputField}
              name={fieldNames.code}
            />
          </InputControl>
          <div className={b('button')()}>
            <Button isShowPreloader={isBtnDisabled} disabled={isBtnDisabled}>
              Verify
            </Button>
          </div>
        </form>
      </Layout>
    );
  }

  @bind
  private handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    const { handleSubmit, sendTwoFactorData, provider } = this.props;
    handleSubmit((data: NS.ITwoFactorForm) => {
      sendTwoFactorData({ code: data.code, provider });
    })(e);
  }
}

export default reduxForm<NS.ITwoFactorForm, {}>({ form: name })(
  connect<IStateProps, IDispatchProps>(mapState, mapDispatch)(TwoFactorForm),
);
