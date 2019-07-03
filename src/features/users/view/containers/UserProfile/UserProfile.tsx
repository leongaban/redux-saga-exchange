import React from 'react';
import { connect } from 'react-redux';
import { bind } from 'decko';
import block from 'bem-cn';
import { bindActionCreators, Dispatch } from 'redux';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { Modal, Tabs, Preloader } from 'shared/view/elements';
import {
  KycInfo,
  ProfileDetailsForm,
  OpenOrdersReport,
  UserBalance,
  UserOrderHistory,
} from '../';
import { IAdminPanelUser } from 'shared/types/models';
import { IAppReduxState } from 'shared/types/app';
import { containersProvider, IContainerTypes } from 'core';

import { actions, selectors } from '../../../redux';
import * as NS from '../../../namespace';
import './UserProfile.scss';

const profileTabs: NS.ProfileTab[] = [
  'basic info',
  'kyc info',
  'balance',
  'transactions',
  'open orders',
  'order history',
];

interface IStateProps {
  editedUser: IAdminPanelUser | null;
  isUserProfilModaleShown: boolean;
}

interface IActionProps {
  setUserProfileModalState: typeof actions.setUserProfileModalState;
}

interface IProviderProps {
  TransactionsTable: IContainerTypes['TransactionsTable'];
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    editedUser: selectors.selectCurrentUserProfile(state),
    isUserProfilModaleShown: selectors.selectIsUserProfileModalShown(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    setUserProfileModalState: actions.setUserProfileModalState,
  }, dispatch);
}

interface IState {
  activeTab: NS.ProfileTab;
}

type IProps = IStateProps & IActionProps & ITranslateProps & IProviderProps;

const b = block('user-profile');

class UserProfile extends React.PureComponent<IProps, IState> {
  public state: IState = {
    activeTab: profileTabs[0],
  };

  private get tabs() {
    const { activeTab } = this.state;
    return profileTabs.map(tab => ({
      title: tab,
      key: tab,
      active: activeTab === tab,
      onClick: () => this.setActiveTab(tab),
    }));
  }

  public render() {
    const { isUserProfilModaleShown, editedUser } = this.props;

    if (editedUser === null) {
      console.warn('editedUser is not initialized yet');
      return null;
    }

    return (
      <Modal
        isOpen={isUserProfilModaleShown}
        onClose={this.handleModalClose}
        hasCloseCross={true}
        title={<Tabs tabs={this.tabs} />}
        withVerticalScroll
      >
        <div className={b()} >
          <div className={b('content')()}>
            {this.renderCurrentTab(editedUser)}
          </div>
        </div>
      </Modal>
    );
  }

  @bind
  private renderCurrentTab(editedUser: IAdminPanelUser) {
    const { id } = editedUser;
    switch (this.state.activeTab) {
      case 'basic info':
        return (
          <ProfileDetailsForm
            currentProfile={editedUser}
            onCancelButtonClick={this.handleModalClose}
          />
        );
      case 'kyc info':
        return <KycInfo currentUserProfile={editedUser} />;
      case 'balance':
        return <UserBalance currentProfile={editedUser} />;
      case 'transactions':
        const { TransactionsTable } = this.props;
        return <TransactionsTable userID={id} />;
      case 'open orders':
        return <OpenOrdersReport userID={id} />;
      case 'order history':
        return <UserOrderHistory userID={id} />;
      default:
        break;
    }
  }

  @bind
  private setActiveTab(activeTab: NS.ProfileTab) {
    this.setState({ activeTab });
  }

  @bind
  private handleModalClose() {
    this.setState({
      activeTab: profileTabs[0],
    });
    this.props.setUserProfileModalState(false);
  }
}

export default (
  containersProvider(['TransactionsTable'], <Preloader isShow />)(
    connect(mapState, mapDispatch)(
      i18nConnect(
        UserProfile,
      ),
    ),
  )
);
