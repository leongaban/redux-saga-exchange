import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IAppReduxState } from 'shared/types/app';
import { Button, Preloader } from 'shared/view/elements';
import { ISecretInfo, TwoFAType } from 'shared/types/models';
import { QrCode } from 'shared/view/components';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { ICommunication } from 'shared/types/redux';

import { selectors, actions } from './../../../redux';
import { Toggle2faForm } from '../../components';
import * as NS from '../../../namespace';
import './TwoFactorForm.scss';

interface IStateProps {
  secretInfo: ISecretInfo | null;
  shouldShowVerificationForm: boolean;
  sendCodeToEmailCommunication: ICommunication;
  loadSecretInfoCommincation: ICommunication;
}

interface IDispatchProps {
  loadSecretInfo: typeof actions.loadSecretInfo;
  sendVerificationCode: typeof actions.sendVerificationCode;
  sendCodeToEmail: typeof actions.sendCodeToEmail;
  disable2FA: typeof actions.disable2FA;
}

type IProps = IStateProps & IDispatchProps & ITranslateProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    secretInfo: selectors.selectSecretInfo(state),
    shouldShowVerificationForm: selectors.selectShouldShowVerificationForm(state),
    sendCodeToEmailCommunication: selectors.selectCommunication(state, 'sendCodeToEmail'),
    loadSecretInfoCommincation: selectors.selectCommunication(state, 'loadSecretInfo'),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IDispatchProps {
  return bindActionCreators({
    loadSecretInfo: actions.loadSecretInfo,
    sendVerificationCode: actions.sendVerificationCode,
    sendCodeToEmail: actions.sendCodeToEmail,
    disable2FA: actions.disable2FA,
  }, dispatch);
}

const b = block('two-factor-form');

class TwoFactorForm extends React.PureComponent<IProps> {

  public componentDidMount() {
    this.props.loadSecretInfo();
  }

  public render() {
    const {
      secretInfo, translate: t, loadSecretInfoCommincation,
      shouldShowVerificationForm, sendCodeToEmailCommunication,
    } = this.props;

    const shouldShowPreloader = loadSecretInfoCommincation.isRequesting ||
      sendCodeToEmailCommunication.isRequesting;

    return (
      <div className={b()}>
        <Preloader position="relative" isShow={shouldShowPreloader} size={10}>
          {this.renderFormTitle()}
          <div className={b('content')()}>
            <div className={b('form')()}>
              <div className={b('button')()}>
                {this.renderButton()}
              </div>

              {shouldShowVerificationForm && secretInfo && (
                <Toggle2faForm
                  is2FAEnabled={secretInfo.is2FAEnabled}
                  onCodeSubmit={this.handleVerificationFormSubmit}
                />
              )}

            </div>

            {secretInfo && !secretInfo.is2FAEnabled && shouldShowVerificationForm && (
              <div className={b('qr-code')()}>
                <div className={b('qr-code-value')()}>
                  <QrCode value={secretInfo.qrCode} size={170} />
                </div>
                <div className={b('secret-code')()}>
                  <div className={b('secret-code-title')()}>
                    {t('TWO-FA-PROVIDER:TWO-FACTOR-FORM:SECRET-CODE-LABEL')}
                  </div>
                  <div className={b('secret-code-value')()}>{secretInfo.secretCode}</div>
                </div>
              </div>
            )}
          </div>
        </Preloader>
      </div>
    );
  }

  private renderButton() {
    const { secretInfo, shouldShowVerificationForm } = this.props;
    if (secretInfo && !shouldShowVerificationForm) {
      return secretInfo.is2FAEnabled
        ? (
          <Button onClick={this.handleDisableButtonClick} type="button" color="green">
            Switch to email
             </Button>
        )
        : (
          <Button onClick={this.handleEnableButtonClick} type="button" color="green">
            Switch to authenticator
             </Button>
        );
    }
  }

  @bind
  private renderFormTitle() {
    const { secretInfo, translate: t, shouldShowVerificationForm } = this.props;
    if (secretInfo) {
      const { is2FAEnabled } = secretInfo;
      const provider: TwoFAType = is2FAEnabled ? 'Authenticator' : 'Email';
      return (
        <div className={b('form-title')()}>
          <div className={b('form-label')()}>
            {t('TWO-FA-PROVIDER:TWO-FACTOR-FORM:TWO-FA-MODE-LABEL', {
              provider,
            })}
          </div>
          {!shouldShowVerificationForm && (
            <div className={b('form-label')()}>
              {t('TWO-FA-PROVIDER:TWO-FACTOR-FORM:TWO-FA-INSTRUCTIONS')}
            </div>
          )}
        </div>
      );
    }
  }

  @bind
  private handleDisableButtonClick() {
    const { disable2FA } = this.props;
    disable2FA();
  }

  @bind
  private handleEnableButtonClick() {
    const { sendCodeToEmail } = this.props;
    sendCodeToEmail();
  }

  @bind
  private handleVerificationFormSubmit(data: NS.IToggle2faForm) {
    const { sendVerificationCode } = this.props;
    sendVerificationCode(data);
  }
}

const translated = i18nConnect(TwoFactorForm);
const container = connect<IStateProps, IDispatchProps>(mapState, mapDispatch)(translated);

export { TwoFactorForm };
export default container;
