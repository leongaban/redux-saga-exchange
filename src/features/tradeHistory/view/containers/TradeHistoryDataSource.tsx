import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as socketsActions } from 'services/sockets';

import { actions } from '../../redux';
import { IAppReduxState } from 'shared/types/app';

interface IOwnProps {
  currentMarket: string;
}

interface IActionProps {
  reset: typeof actions.reset;
  subscribe: typeof actions.subscribeToEvent;
  unsubscribe: typeof actions.unsubscribeFromEvent;
  openChannel: typeof socketsActions.openChannel;
  closeChannel: typeof socketsActions.closeChannel;
}

type IProps = IActionProps & IOwnProps;

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    subscribe: actions.subscribeToEvent,
    reset: actions.reset,
    unsubscribe: actions.unsubscribeFromEvent,
    openChannel: socketsActions.openChannel,
    closeChannel: socketsActions.closeChannel,
  }, dispatch);
}

// TODO move it from feature
class TradeHistoryDataSource extends React.PureComponent<IProps> {
  public componentDidMount() {
    const channel = this.getChannelName(this.props);
    this.subscribe(channel);
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (this.props.currentMarket !== nextProps.currentMarket) {
      this.props.reset();
      const prevChannelName = this.getChannelName(this.props);
      const nextChannelName = this.getChannelName(nextProps);
      this.unsubscribe(prevChannelName);
      this.subscribe(nextChannelName);
    }
  }

  public componentWillUnmount() {
    const channel = this.getChannelName(this.props);
    this.unsubscribe(channel);
    this.props.reset();
  }

  public render() {
    return null;
  }

  private subscribe(channel: string) {
    const { openChannel, subscribe } = this.props;
    openChannel(channel);
    subscribe(channel);
  }

  private unsubscribe(channel: string) {
    const { closeChannel, unsubscribe } = this.props;
    unsubscribe(channel);
    closeChannel(channel);
  }

  private getChannelName(props: IProps) {
    const { currentMarket } = props;
    return `Trades.${currentMarket}`;
  }
}

export default connect(null, mapDispatch)(TradeHistoryDataSource);
