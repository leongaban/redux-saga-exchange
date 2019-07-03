import * as React from 'react';
import { bind, debounce } from 'decko';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IContainerTypes, containersProvider } from 'core';

import { IAppReduxState } from 'shared/types/app';
import moment from 'services/moment';
import { actions, selectors } from './../../../redux';

interface IStateProps {
  isModalSessionExpirationOpen: boolean;
}

interface IOwnProps {
  onSessionExpired(): void;
}

interface IActionProps {
  setLastActivity: typeof actions.setLastActivity;
  toggleModalSessionExpirationState: typeof actions.toggleModalSessionExpirationState;
  toggleUserActivityChecking: typeof actions.toggleUserActivityChecking;
  startUserActivityChecking: typeof actions.startUserActivityChecking;
}

interface IProviderProps {
  SessionExpiration: IContainerTypes['SessionExpiration'];
}

type IProps = IStateProps & IActionProps & IProviderProps & IOwnProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    isModalSessionExpirationOpen: selectors.selectIsModalSessionExpirationOpen(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    setLastActivity: actions.setLastActivity,
    toggleModalSessionExpirationState: actions.toggleModalSessionExpirationState,
    toggleUserActivityChecking: actions.toggleUserActivityChecking,
    startUserActivityChecking: actions.startUserActivityChecking,
  }, dispatch);
}

export const userActivityEvents = [
  'mousemove', 'keydown', 'wheel', 'DOMMouseScroll', 'mouseWheel', 'mousedown', 'touchstart', 'touchmove',
  'MSPointerDown', 'MSPointerMove',
];

class UserActivityMonitoring extends React.PureComponent<IProps> {

  public componentDidMount() {
    const { setLastActivity, startUserActivityChecking } = this.props;
    const currentTime = moment();
    setLastActivity(currentTime);
    startUserActivityChecking();
    userActivityEvents.map((event) => { window.document.addEventListener(event, this.handleUserActivityEvent); });
  }

  public componentWillUnmount() {
    this.props.toggleUserActivityChecking(false);
    userActivityEvents.map((event) => { window.document.removeEventListener(event, this.handleUserActivityEvent); });
  }

  public render() {
    const { SessionExpiration, isModalSessionExpirationOpen, onSessionExpired } = this.props;
    return (
      isModalSessionExpirationOpen && (
        <SessionExpiration
          onClose={this.makeToggleModalSessionExpirationStateHandler(false)}
          onSessionExpired={onSessionExpired}
        />)
    );
  }

  @bind
  @debounce(5000)
  private handleUserActivityEvent(e: Event) {
    const { setLastActivity } = this.props;
    setLastActivity(moment());
  }

  @bind
  private makeToggleModalSessionExpirationStateHandler(state: boolean) {
    const { toggleModalSessionExpirationState, setLastActivity } = this.props;
    return () => {
      setLastActivity(moment());
      toggleModalSessionExpirationState(state);
    };
  }
}

export { UserActivityMonitoring };

export default (
  containersProvider(['SessionExpiration'], <div />)(
    connect(mapState, mapDispatch)(
      UserActivityMonitoring,
    ),
  )
);
