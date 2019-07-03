import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Location, Action, UnregisterCallback } from 'history';
import { bind } from 'decko';
import block from 'bem-cn';

interface IOwnProps {
  children: (data: { isActive: boolean, handleCancel(): void, handleConfirm(): void }) => React.ReactNode;
  when: boolean;
  disableNative?: boolean;
  beforeCancel?(): void;
  beforeConfirm?(): void;
}

interface IState {
  action: Action | null;
  nextLocation: Location | null;
  isActive: boolean;
}

type IProps = IOwnProps & RouteComponentProps<{}>;

const b = block('navigation-prompt');

class NavigationPrompt extends React.Component<IProps, IState> {
  public state: IState = this.getInitialState();

  private unblock: UnregisterCallback = this.props.history.block(this.block);

  public componentDidMount() {
    if (!this.props.disableNative) {
      window.addEventListener('beforeunload', this.handleWindowBeforeUnload);
    }
  }

  public componentWillUnmount() {
    this.unblock();
    if (!this.props.disableNative) {
      window.removeEventListener('beforeunload', this.handleWindowBeforeUnload);
    }
  }

  public render() {
    if (!this.state.isActive) {
      return null;
    }
    return (
      <div className={b()}>
        {this.props.children({
          isActive: this.state.isActive,
          handleConfirm: this.handleConfirm,
          handleCancel: this.handleCancel,
        })}
      </div>
    );
  }

  private getInitialState(): IState {
    return {
      action: null,
      isActive: false,
      nextLocation: null,
    };
  }

  @bind
  private block(nextLocation: Location, action: Action) {
    const { when, location } = this.props;
    if (when && location.pathname !== nextLocation.pathname) {
      this.setState({
        action,
        nextLocation,
        isActive: true,
      });
      return false;
    }
  }

  @bind
  private navigateToNextLocation() {
    const { action, nextLocation } = this.state;
    const { history } = this.props;

    this.unblock();

    if (action && nextLocation) {
      if (action === 'PUSH') {
        history.push(nextLocation);
      } else if (action === 'REPLACE') {
        history.replace(nextLocation);
      } else if (action === 'POP') {
        history.goBack();
      }
    }
  }

  @bind
  private handleCancel() {
    const { beforeCancel } = this.props;
    if (beforeCancel) {
      beforeCancel();
    }
    this.setState(this.getInitialState());
  }

  @bind
  private handleConfirm() {
    const { beforeConfirm } = this.props;
    if (beforeConfirm) {
      beforeConfirm();
    }
    this.navigateToNextLocation();
  }

  @bind
  private handleWindowBeforeUnload(event: BeforeUnloadEvent) {
    if (this.props.when) {
      event.returnValue = ''; // for a confirmation to leave the page dialog to show up
    }
  }
}

export default withRouter(NavigationPrompt);
