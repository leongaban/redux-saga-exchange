import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import block from 'bem-cn';
import { bind } from 'decko';

import { IAppReduxState } from 'shared/types/app';
import { ICommunication } from 'shared/types/redux';
import { Checkbox, Button, Link } from 'shared/view/elements';
import { isSuccessedByState } from 'shared/helpers/redux';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { actions as configActions, selectors as configSelectors } from 'services/config';
import { actions as notificationActions } from 'services/notification';

import { actions } from '../../../redux';
import { documentsLinks } from './constants';
import { AuthLayout } from '../../containers';
import './TermsOfService.scss';

const b = block('terms-of-service');

interface IStateProps {
  isAcceptTOSRequesting: ICommunication;
}

interface IDispatchProps {
  saveUserConfig: typeof configActions.saveUserConfig;
  logout: typeof actions.logout;
  setNotification: typeof notificationActions.setNotification;
}

interface IOwnProps {
  onSuccesfulTermsAccept: () => void;
}

type IProps = IOwnProps & ITranslateProps & IStateProps & IDispatchProps;

interface IState {
  haveUserAgreedToTOS: boolean;
}

function mapState(state: IAppReduxState) {
  return {
    isAcceptTOSRequesting: configSelectors.selectCommunication(state, 'saveUserConfig'),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IDispatchProps {
  return bindActionCreators({
    saveUserConfig: configActions.saveUserConfig,
    logout: actions.logout,
    setNotification: notificationActions.setNotification,
  }, dispatch);
}

class TermsOfService extends React.PureComponent<IProps, IState> {
  public state = {
    haveUserAgreedToTOS: false,
  };

  public componentDidUpdate(prevProps: IProps) {
    const { isAcceptTOSRequesting, onSuccesfulTermsAccept } = this.props;
    const { isAcceptTOSRequesting: prevIsAcceptTOSRequesting } = prevProps;
    if (isSuccessedByState(prevIsAcceptTOSRequesting, isAcceptTOSRequesting)) {
      onSuccesfulTermsAccept();
    }
  }

  public render() {
    const { translate: t, isAcceptTOSRequesting } = this.props;
    const { haveUserAgreedToTOS } = this.state;
    const title = `${t('AUTH:TERMS-OF-SERVICE:TITLE')}:`;
    return (
      <AuthLayout>
        <div className={b()}>
          <h2 className={b('title')()}>{title}</h2>
          {this.renderDocuments()}
          <div className={b('confirm-checkbox')()}>
            <Checkbox
              label={t('AUTH:TERMS-OF-SERVICE:CONFIRM-CHECKBOX-LABEL')}
              onChange={this.handleConfirmCheckboxChange}
              checked={haveUserAgreedToTOS}
            />
          </div>
          <div className={b('agree-button')()}>
            <Button
              onClick={this.handleAcceptTOSButtonClick}
              isShowPreloader={isAcceptTOSRequesting.isRequesting}
            >
              {t('AUTH:TERMS-OF-SERVICE:AGREE-BUTTON-TEXT')}
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  private renderDocuments() {
    const { translate: t } = this.props;
    return (
      <ul className={b('documents')()}>
        <li className={b('document')()}>
          <Link href={documentsLinks.tos} target="_blank">
            {t('AUTH:TERMS-OF-SERVICE:DOCUMENTS:TOS')}
          </Link>
        </li>
        <li className={b('document')()}>
          <Link href={documentsLinks.privacyPolicy} target="_blank">
            {t('AUTH:TERMS-OF-SERVICE:DOCUMENTS:PRIVACY-POLICY')}
          </Link>
        </li>          <li className={b('document')()}>
          <Link href={documentsLinks.personalInformation} target="_blank">
            {t('AUTH:TERMS-OF-SERVICE:DOCUMENTS:PERSONAL-INFORMATON')}
          </Link>
        </li>
        <li className={b('document')()}>
          <Link href={documentsLinks.aml} target="_blank">
            {t('AUTH:TERMS-OF-SERVICE:DOCUMENTS:AML')}
          </Link>
        </li>
      </ul>
    );
  }

  @bind
  private handleConfirmCheckboxChange() {
    this.setState((prevState: IState) => ({
      haveUserAgreedToTOS: !prevState.haveUserAgreedToTOS,
    }));
  }

  @bind
  private handleAcceptTOSButtonClick() {
    const { saveUserConfig, setNotification, translate: t } = this.props;
    const { haveUserAgreedToTOS } = this.state;
    if (haveUserAgreedToTOS) {
      saveUserConfig({ areTOSAccepted: true });
    } else {
      setNotification({
        kind: 'error',
        text: t('AUTH:TERMS-OF-SERVICE:NOT-CONFIRMED-ACCEPT-NOTIFICATION'),
      });
    }
  }
}

export default connect(mapState, mapDispatch)(i18nConnect(TermsOfService));
