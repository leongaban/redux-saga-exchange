import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';

import { required, length } from 'shared/helpers/validators';
import { InputField, IInputFieldProps } from 'shared/view/redux-form';
import { Button, Modal, Icon } from 'shared/view/elements';
import { IAppReduxState } from 'shared/types/app';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { selectors as configSelectors } from 'services/config';
import { ICommunication } from 'shared/types/redux';
import { TwoFAType } from 'shared/types/models';
import { ClientDeviceType } from 'shared/types/ui';

import { reduxFormEntries, actions, selectors } from '../../../redux';
import * as NS from '../../../namespace';
import './VerificationModal.scss';

const { verificationFormEntry: { name, fieldNames } } = reduxFormEntries;

interface IStateProps {
  isVerificationModalOpen: boolean;
  retries: number;
  provider: TwoFAType;
  maxNumberOfRetries: number;
  verifyCommunication: ICommunication;
  clientDeviceType: ClientDeviceType;
}

interface IDispatchProps {
  verify: typeof actions.verify;
  resetState: typeof actions.reset;
  terminateVerification: typeof actions.terminateVerification;
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IDispatchProps {
  return bindActionCreators({
    resetState: actions.reset,
    terminateVerification: actions.terminateVerification,
    verify: actions.verify,
  }, dispatch);
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    isVerificationModalOpen: selectors.selectIsVerificationModalOpen(state),
    retries: selectors.selectRetriesAmount(state),
    provider: selectors.selectProvider(state),
    maxNumberOfRetries: selectors.selectMaxNumberOfRetries(state),
    verifyCommunication: selectors.selectVerifyCommunication(state),
    clientDeviceType: configSelectors.selectClientDeviceType(state),
  };
}

type IProps = IStateProps & IDispatchProps & ITranslateProps
  & InjectedFormProps<NS.IVerificationCodeForm, {}>;

const CodeFieldWrapper = Field as new () => Field<IInputFieldProps>;

const validateByLength6 = length(6);

const b = block('verification-modal');

class VerificationModal extends React.PureComponent<IProps> {

  public componentWillUnmount() {
    this.props.resetState();
  }

  public render() {
    const {
      translate: t, isVerificationModalOpen, retries, maxNumberOfRetries,
      verifyCommunication: { isRequesting }, provider, clientDeviceType,
    } = this.props;
    return (
      <Modal
        isOpen={isVerificationModalOpen}
        onClose={this.handleModalClose}
        hasCloseCross
        title={t('PROTECTOR:VERIFICATION-MODAL:TITLE', { provider })}
      >
        <form className={b()} onSubmit={this.handleFormSubmit}>
          <div className={b('key')()} >
            <Icon className={b('key-icon')()} src={require('./images/key-inline.svg')} />
          </div>
          <div className={b('input')()}>
            <CodeFieldWrapper
              component={InputField}
              name={fieldNames.code}
              placeholder={t('PROTECTOR:VERIFICATION-MODAL:CODE-INPUT-PLACEHOLDER')}
              translate={t}
              validateOnChange
              validate={[required, validateByLength6]}
            />
          </div>
          {retries > 1 &&
            <div className={b('retries-amount')()}>
              {t('PROTECTOR:VERIFICATION-MODAL:NUMBER-OF-RETRIES-TEXT', {
                retries: String(maxNumberOfRetries - retries)
              })}
            </div>
          }
          <div className={b('footer')()}>
            {
              clientDeviceType === 'mobile' && (
                <Button onClick={this.handleModalClose} color="black-white">
                  {t('SHARED:BUTTONS:CANCEL')}
                </Button>
              )
            }
            <Button color="green" disabled={isRequesting} isShowPreloader={isRequesting}>
              {t('SHARED:BUTTONS:SUBMIT')}
            </Button>
          </div>
        </form>
      </Modal>
    );
  }

  @bind
  private handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    const { handleSubmit, verify } = this.props;
    handleSubmit((data) => {
      verify(data.code);
    })(e);
  }

  @bind
  private handleModalClose() {
    this.props.terminateVerification();
  }
}

export { VerificationModal };
export default (
  reduxForm<NS.IVerificationCodeForm, {}>({ form: name })(
    connect(mapState, mapDispatch)(
      i18nConnect(
        VerificationModal,
      ),
    ),
  )
);
