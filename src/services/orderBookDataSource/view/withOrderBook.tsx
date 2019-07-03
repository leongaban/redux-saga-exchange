// import * as React from 'react';
// import { connect, Dispatch } from 'react-redux';
// import * as R from 'ramda';
// import { bindActionCreators } from 'redux';

// import { IAppReduxState } from 'shared/types/app';
// import { actions as socketActions } from 'services/sockets';
// import { ITradeOrders } from 'shared/types/models';

// import * as actions from '../redux/actions';
// import * as selectors from '../redux/data/selectors';

// interface IWithOrderBookProps {
//   orderBook: ITradeOrders;
//   totalAskVolume: number;
//   totalBidVolume: number;
// }

// interface IWithOrderBookConfig<T> {
//   getChannelName(props: T): string;
//   predicat(prevProps: T, nextProps: T): boolean;
// }

// interface IStateProps {
//   orders: ITradeOrders;
//   totalAskVolume: number;
//   totalBidVolume: number;
//   // subscribesAmount: number;
// }

// interface IActionProps {
//   // setSubscribesAmount: typeof actions.setSubscribesAmount;
//   subscribeToEvent: typeof actions.subscribeToEvent;
//   unsubscribeFromEvent: typeof actions.unsubscribeFromEvent;
//   openChannel: typeof socketActions.openChannel;
//   closeChannel: typeof socketActions.closeChannel;
// }

// type IProps = IStateProps & IActionProps;

// function mapState(state: IAppReduxState): IStateProps {
//   return {
//     orders: selectors.selectOrders(state),
//     totalAskVolume: selectors.selectTotalAskVolume(state),
//     totalBidVolume: selectors.selectTotalBidVolume(state),
//     // subscribesAmount: selectors.selectSubscribesAmount(state),
//   };
// }

// function mapDispatch(dispatch: Dispatch<any>): IActionProps {
//   return bindActionCreators({
//     // setSubscribesAmount: actions.setSubscribesAmount,
//     subscribeToEvent: actions.subscribeToEvent,
//     unsubscribeFromEvent: actions.unsubscribeFromEvent,
//     openChannel: socketActions.openChannel,
//     closeChannel: socketActions.closeChannel,
//   }, dispatch);
// }

// let amount = 0;

// function withOrderBook<T>(options: IWithOrderBookConfig<T>) {
//   const { getChannelName, predicat } = options;

//   return (WrappedComponent: React.ComponentType<T & IWithOrderBookProps>): React.ComponentType<T>  => {
//     type ResultProps = T & IProps;

//     const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

//     class WithOrderBook extends React.PureComponent<ResultProps> {
//       public static displayName: string = `WithOrderBook(${wrappedComponentName})`;

//       public componentDidMount() {
//         this.subscribe(this.currentChannel);
//       }

//       public componentWillReceiveProps(nextProps: Readonly<ResultProps>) {
//         if (predicat(this.props as any, nextProps as any)) {
//           const prevChannelName = getChannelName(this.props as any);
//           const nextChannelName = getChannelName(nextProps as any);
//           this.unsubscribe(prevChannelName);
//           this.subscribe(nextChannelName);
//         }
//       }

//       public componentWillUnmount() {
//         this.unsubscribe(this.currentChannel);
//       }

//       public render() {
//         const restProps = R.omit(// TODO think about omitting props
//           ['subscribeToEvent', 'unsubscribeFromEvent', 'openChannel', 'closeChannel', 'orders'], this.props,
//         );
//         const { orders, totalAskVolume, totalBidVolume } = this.props;

//         return (
//           <WrappedComponent
//             {...restProps}
//             orderBook={orders}
//             totalAskVolume={totalAskVolume}
//             totalBidVolume={totalBidVolume}
//           />
//         );
//       }

//       private get currentChannel() {
//         console.log(getChannelName(this.ownProps));
//         return getChannelName(this.ownProps);
//       }

//       private get ownProps(): T {
//         return R.omit(// TODO think about omitting props
//           ['subscribeToEvent', 'unsubscribeFromEvent', 'openChannel', 'closeChannel', 'orders'], this.props,
//         ) as any;
//       }

//       private subscribe(channel: string) {
//         const { openChannel, subscribeToEvent } = this.props;
//         if (amount === 0) {
//           openChannel(channel);
//         }
//         subscribeToEvent(channel);
//         // setSubscribesAmount(subscribesAmount + 1);
//         amount ++;
//       }

//       private unsubscribe(channel: string) {
//         const { closeChannel, unsubscribeFromEvent } = this.props;
//         unsubscribeFromEvent(channel);
//         amount --;

//         if (amount === 0) {
//           closeChannel(channel);
//         }
//         // setSubscribesAmount(subscribesAmount - 1);
//       }
//     }

//     return connect<IStateProps, IActionProps, T>(mapState, mapDispatch)(WithOrderBook);
//   };
// }

// export { IWithOrderBookProps };
// export default withOrderBook;
