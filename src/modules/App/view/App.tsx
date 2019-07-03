import React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IAppReduxState } from 'shared/types/app';
import { ICommunication } from 'shared/types/redux';
import { isProcessedByState, isSuccessedByState } from 'shared/helpers/redux';
import { actions as socketsActions } from 'services/sockets';
import { containers as monitoringContainers } from 'features/userActivityMonitoring';
import {
  containers as protectorContainers,
  selectors as protectorSelectors,
} from 'services/protector';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { selectors as configSelectors, ClientDeviceContext } from 'services/config';
import { containers as notificationContainers } from 'services/notification';
import { MiniTickerDataSource } from 'services/miniTickerDataSource';
import { OpenOrdersDataSource } from 'services/openOrdersDataSource';
import { ErrorBoundary } from 'shared/view/components';
import { Preloader } from 'shared/view/elements';
import { ConfigProvider, ThemeProvider } from 'services/config/view/containers';
import routes from '../../routes';

import 'shared/view/styles/base.scss';

import './styles.scss';
import { ClientDeviceType } from 'shared/types/ui';

interface IStateProps {
  restoringSession: ICommunication;
  communicationLoadAssetsInfo: ICommunication;
  isVerificationModalOpen: boolean;
  isAuthorized: boolean;
  isAdminAuthorized: boolean;
  isRestoreSessionRequesting: boolean;
  restoringAdminSession: ICommunication;
  clientDeviceType: ClientDeviceType;
}

interface IDispatchProps {
  subscribeToEvent: typeof userActions.subscribeToEvent;
  restoreSession: typeof userActions.restoreSession;
  restoreAdminSession: typeof userActions.restoreAdminSession;
  loadBalances: typeof userActions.loadBalances;
  openChannel: typeof socketsActions.openChannel;
  closeChannel: typeof socketsActions.closeChannel;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    restoringSession: userSelectors.selectSessionRestoring(state),
    isVerificationModalOpen: protectorSelectors.selectIsVerificationModalOpen(state),
    isAuthorized: userSelectors.selectIsAuthorized(state),
    isAdminAuthorized: userSelectors.selectIsAdminAuthorized(state),
    isRestoreSessionRequesting: userSelectors.selectSessionRestoring(state).isRequesting,
    restoringAdminSession: userSelectors.selectIsAdminSessionRestoring(state),
    communicationLoadAssetsInfo: configSelectors.selectCommunicationLoadAssetsInfo(state),
    clientDeviceType: configSelectors.selectClientDeviceType(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IDispatchProps {
  return bindActionCreators({
    subscribeToEvent: userActions.subscribeToEvent,
    restoreSession: userActions.restoreSession,
    loadBalances: userActions.loadBalances,
    restoreAdminSession: userActions.restoreAdminSession,
    openChannel: socketsActions.openChannel,
    closeChannel: socketsActions.closeChannel,
  }, dispatch);
}

interface IState {
  isUserLoggedIn: boolean;
  isAssetsInfoLoaded: boolean;
}

type IProps = IStateProps & IDispatchProps & RouteComponentProps<{}>;

const b = block('application');

class App extends React.Component<IProps, IState> {
  public state: IState = { isUserLoggedIn: false, isAssetsInfoLoaded: false };
  private isAdminPanel = document.location.pathname.includes('admin');

  public componentDidMount() {
    const { restoreAdminSession, restoreSession } = this.props;

    if (this.isAdminPanel) {
      restoreAdminSession();
    } else {
      restoreSession();
    }
  }

  public componentWillReceiveProps({
    restoringSession, isAuthorized, communicationLoadAssetsInfo,
    restoringAdminSession,
  }: IProps) {

    const {
      restoringSession: prevRestoringSession,
      restoringAdminSession: prevRestoringAdminSession,
      communicationLoadAssetsInfo: prevCommunicationLoadAssetsInfo,
      openChannel,
      closeChannel,
      subscribeToEvent,
      loadBalances,
      isAuthorized: prevIsAuthorized,
    } = this.props;

    if (isProcessedByState(prevRestoringSession, restoringSession)) {
      this.setState({ isUserLoggedIn: true }); // TODO think about when user loggin in through login form
    }

    if (isProcessedByState(prevRestoringAdminSession, restoringAdminSession)) {
      this.setState({ isUserLoggedIn: true }); // TODO think about when user loggin in through login form
    }

    if (isSuccessedByState(prevCommunicationLoadAssetsInfo, communicationLoadAssetsInfo)) {
      this.setState({ isAssetsInfoLoaded: true });
    }

    if (!prevIsAuthorized && isAuthorized) {
      openChannel('Balance');
      loadBalances();
      subscribeToEvent('Balance');
    } else if (prevIsAuthorized && !isAuthorized) {
      closeChannel('Balance');
    }

  }

  public render() {
    const {
      isVerificationModalOpen, isAuthorized, children, isRestoreSessionRequesting, clientDeviceType,
      isAdminAuthorized,
    } = this.props;
    const { isUserLoggedIn, isAssetsInfoLoaded } = this.state;
    const isShownContent = isAuthorized ? isAssetsInfoLoaded : isUserLoggedIn;
    return (
      <div className={b()}>
        <Preloader isShow={isRestoreSessionRequesting} />
        <ClientDeviceContext.Provider value={clientDeviceType}>
          <ErrorBoundary
            staticErrorMessage="Something went wrong"
            onButtonClick={this.handleReloadClick}
          >
            <notificationContainers.Notification />
            <ThemeProvider />
            {isShownContent && children}
            {isAuthorized && this.renderAuthorizedContent()}
            {isAdminAuthorized && this.renderAdminAuthorizedContent()}
            {isVerificationModalOpen && <protectorContainers.VerificationModal />}
          </ErrorBoundary>
        </ClientDeviceContext.Provider>
      </div>
    );
  }

  @bind
  private renderAuthorizedContent() {
    return (
      <React.Fragment>
        <monitoringContainers.UserActivityMonitoring onSessionExpired={this.handleSessionExpired} />
        <MiniTickerDataSource />
        <OpenOrdersDataSource />
        <ConfigProvider />
      </React.Fragment>
    );
  }

  @bind
  private renderAdminAuthorizedContent() {
    return (
      <React.Fragment>
        <ConfigProvider />
      </React.Fragment>
    );
  }

  @bind
  private handleReloadClick() {
    window.location.reload();
  }

  @bind
  private handleSessionExpired() {
    this.props.history.push(routes.auth.logout.getPath());
  }
}

export default withRouter(connect(mapState, mapDispatch)(App));
