import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as socketActions } from 'services/sockets';

import * as actions from '../redux/actions';

interface IOwnProps {
  currentMarket: string;
}

interface IActionProps {
  reset: typeof actions.reset;
  subscribe: typeof actions.subscribe;
  unsubscribe: typeof actions.unsubscribe;
  openChannel: typeof socketActions.openChannel;
  closeChannel: typeof socketActions.closeChannel;
}

type IProps = IActionProps & IOwnProps;

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    reset: actions.reset,
    subscribe: actions.subscribe,
    unsubscribe: actions.unsubscribe,
    openChannel: socketActions.openChannel,
    closeChannel: socketActions.closeChannel,
  }, dispatch);
}

class OrderBookDataSource extends React.PureComponent<IProps> {
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
    return `Book.${currentMarket}`;
  }
}

export default connect(null, mapDispatch)(OrderBookDataSource);
