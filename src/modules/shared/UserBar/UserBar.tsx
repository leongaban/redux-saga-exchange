import block from 'bem-cn';
import React from 'react';
import { bind } from 'decko';
import { withRouter, RouteComponentProps } from 'react-router';

import { Icon, Modal, Button } from 'shared/view/elements';
import routes from 'modules/routes';
import { i18nConnect, ITranslateProps } from 'services/i18n';

import './UserBar.scss';

const b = block('user-bar-panel');

interface IOwnProps {
  isAdminPanel?: boolean;
  size?: 'big' | 'small';
}

interface IState {
  isLogoutConfirmationModalOpen: boolean;
}

type IProps = IOwnProps & ITranslateProps & RouteComponentProps<{}>;

class UserBar extends React.PureComponent<IProps, IState> {

  public state: IState = {
    isLogoutConfirmationModalOpen: false,
  };

  private get logoutRoute() {
    const { isAdminPanel } = this.props;
    return isAdminPanel ? routes.admin.logout.getPath() : routes.auth.logout.getPath();
  }

  public render() {
    const { size = 'small' } = this.props;
    return (
      <div className={b()}>
        <div className={b('logout')()} onClick={this.handleLogoutIconClick}>
          <Icon className={b('icon', { size })()} src={require('./images/logout-inline.svg')} />
        </div>
        {this.renderLogoutConfirmationModal()}
      </div >
    );
  }

  @bind
  private handleLogoutIconClick() {
    this.setState(() => ({ isLogoutConfirmationModalOpen: true }));
  }

  @bind
  private closeModal() {
    this.setState(() => ({ isLogoutConfirmationModalOpen: false }));
  }

  private renderLogoutConfirmationModal() {
    const { translate: t } = this.props;
    const { isLogoutConfirmationModalOpen } = this.state;

    return (
      <Modal
        isOpen={isLogoutConfirmationModalOpen}
        title={t('SHARED:USER-BAR:LOGOUT-CONFIRMATION-MODAL-TITLE')}
        onClose={this.closeModal}
        hasCloseCross
      >
        <div className={b('logout-confirmation-modal-content')()}>
          <div className={b('logout-confirmation-modal-text')()}>
            {t('SHARED:USER-BAR:LOGOUT-CONFIRMATION-MODAL-TEXT')}
          </div>
          <div className={b('logout-confirmation-modal-buttons')()}>
            <div className={b('logout-confirmation-modal-button')()}>
              <Button color="black-white" onClick={this.closeModal}>
                {t('SHARED:BUTTONS:CANCEL')}
              </Button>
            </div>
            <div className={b('logout-confirmation-modal-button')()}>
              <Button color="green" onClick={this.handleLogoutConfirmationModalYesButtonClick}>
                {t('SHARED:BUTTONS:YES')}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  @bind
  private handleLogoutConfirmationModalYesButtonClick() {
    this.props.history.push(this.logoutRoute);
    this.closeModal();
  }
}

export default (
  withRouter(
    i18nConnect(
      UserBar
    )));
