import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as socketActions } from 'services/sockets';

import * as actions from '../redux/actions';
import { periodQuoteType } from 'shared/types/models';

interface IActionProps {
  reset: typeof actions.reset;
  subscribe: typeof actions.subscribe;
  unsubscribe: typeof actions.unsubscribe;
  openChannel: typeof socketActions.openChannel;
  closeChannel: typeof socketActions.closeChannel;
}

type IProps = IActionProps;

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    reset: actions.reset,
    subscribe: actions.subscribe,
    unsubscribe: actions.unsubscribe,
    openChannel: socketActions.openChannel,
    closeChannel: socketActions.closeChannel,
  }, dispatch);
}

class MiniTickerDataSource extends React.PureComponent<IProps> {
  public componentDidMount() {
    const channel = this.getChannelName();
    this.subscribe(channel);
  }

  public componentWillUnmount() {
    const channel = this.getChannelName();
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

  private getChannelName() {
    return `MiniTicker.${periodQuoteType.Day}`;
  }
}

export default connect(null, mapDispatch)(MiniTickerDataSource);
