import * as React from 'react';
import block from 'bem-cn';
import { bind, debounce } from 'decko';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import * as R from 'ramda';

import {
  IOrderBook, IWidgetContentProps, IOrderBookSettings, IOrderBookOrder,
  OrderSide,
} from 'shared/types/models';
import { IAppReduxState } from 'shared/types/app';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { selectors as miniTickerDataSourceSelectors } from 'services/miniTickerDataSource';
import { CurrencyConverter } from 'services/miniTickerDataSource/namespace';
import { actions as socketsActions } from 'services/sockets';
import { selectors as orderBookDSselectors } from 'services/orderBookDataSource';
import { floorFloatToFixed } from 'shared/helpers/number';
import { selectors as userSelectors } from 'services/user';

import { actions, selectors } from '../../../../redux';
import { LastPrice } from '../../../containers';
import { OrderBookTable } from '../../../components';
import './Content.scss';

interface IOrderBookScrollConfig {
  autoScrollEnabled: boolean;
}

type OrderType = 'bid' | 'ask';

interface IState extends Record<OrderType, IOrderBookScrollConfig> { }

interface IStateProps {
  baseCurrencyBalance: number;
  counterCurrencyBalance: number;
  orderBook: IOrderBook;
  askTotalAmount: number;
  bidTotalAmount: number;
  convertQuoteCurrencyToUSDT: CurrencyConverter;
}

interface IActionProps {
  openChannel: typeof socketsActions.openChannel;
  closeChannel: typeof socketsActions.closeChannel;
  subscribeToTickEvent: typeof actions.subscribeToTickEvent;
  unsubscribeFromTickEvent: typeof actions.unsubscribeFromTickEvent;
  setLastPrice: typeof actions.setLastPrice;
  setDefaultDocumentTitle: typeof actions.setDefaultDocumentTitle;
}

type IOwnProps = IWidgetContentProps<IOrderBookSettings>;

type IProps = IStateProps & IActionProps & ITranslateProps & IOwnProps;

function mapState(state: IAppReduxState, ownProps: IOwnProps): IStateProps {
  const { currentCurrencyPair: { counterCurrency, baseCurrency, id } } = ownProps;
  return {
    orderBook: selectors.selectOrderBook(state, id),
    convertQuoteCurrencyToUSDT: miniTickerDataSourceSelectors.selectQuoteCurrencyToUSDTConverter(
      state, counterCurrency
    ),
    askTotalAmount: orderBookDSselectors.selectAskTotalAmount(state),
    bidTotalAmount: orderBookDSselectors.selectBidTotalAmount(state),
    baseCurrencyBalance: userSelectors.selectBalanceDict(state)[baseCurrency] || 0,
    counterCurrencyBalance: userSelectors.selectBalanceDict(state)[counterCurrency] || 0,
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    ...actions,
    openChannel: socketsActions.openChannel,
    closeChannel: socketsActions.closeChannel,
  }, dispatch);
}

const b = block('order-book-widget-content');

const debounceDelay = 1000;
const orderBookScrollConfig: IOrderBookScrollConfig = {
  autoScrollEnabled: true,
};

class OrderBook extends React.PureComponent<IProps, IState> {
  public state: IState = {
    bid: orderBookScrollConfig,
    ask: orderBookScrollConfig
  };

  private ordersContainer = React.createRef<HTMLDivElement>();

  private reversedAskContainer = React.createRef<HTMLDivElement>();
  private bidContainer = React.createRef<HTMLDivElement>();

  private get amountAccuracy() {
    return this.props.currentCurrencyPair.amountScale;
  }

  private get priceAccuracy(): number {
    const { settings: { decimals }, currentCurrencyPair: { priceScale } } = this.props;

    return decimals === null
      ? priceScale
      : (decimals > priceScale ? priceScale : decimals);
  }

  public componentDidMount() {
    const { currentCurrencyPair, settings: { widgetType } } = this.props;
    this.subscribeToMarket(currentCurrencyPair.id);
    document.body.addEventListener('mousedown', this.handleBodyMousedown);
    if (widgetType === 'vertical') {
      this.addWheelAndScrollEvents();
    }
  }

  public componentWillUnmount() {
    const { currentCurrencyPair, setDefaultDocumentTitle } = this.props;
    this.unsubscribeFromMarket(currentCurrencyPair.id);
    document.body.removeEventListener('mousedown', this.handleBodyMousedown);
    this.removeWheelAndScrollEvents();
    setDefaultDocumentTitle();
  }

  public componentDidUpdate(prevProps: IProps) {
    const {
      orderBook: prevOrderBook, settings: { widgetType: prevWidgetType, displayedOrderType: prevDisplayedOrderType },
      currentCurrencyPair: prevCurrencyPair,
    } = prevProps;
    const {
      settings: { widgetType, displayedOrderType }, orderBook, setLastPrice,
      currentCurrencyPair,
    } = this.props;
    const widgetTypeWasSwitchedToVertical = widgetType === 'vertical' && prevWidgetType === 'horizontal';
    const widgetTypeWasSwitchedToHorizontal = widgetType === 'horizontal' && prevWidgetType === 'vertical';
    const newAskOrdersWereAdded = prevOrderBook.ask.length < orderBook.ask.length;
    const newBidOrdersWereAdded = prevOrderBook.bid.length < orderBook.bid.length;
    const displayedOrderTypeWasSwitched = displayedOrderType !== prevDisplayedOrderType;

    if (prevCurrencyPair.id !== currentCurrencyPair.id) {
      this.unsubscribeFromMarket(prevCurrencyPair.id);
      setLastPrice(null);
      setTimeout(() => this.subscribeToMarket(currentCurrencyPair.id), 300);
    }

    if (widgetTypeWasSwitchedToVertical) {
      this.addWheelAndScrollEvents();
    } else if (widgetTypeWasSwitchedToHorizontal) {
      this.removeWheelAndScrollEvents();
    }

    if (displayedOrderTypeWasSwitched) {
      this.removeWheelAndScrollEvents();
      this.addWheelAndScrollEvents();
    }

    if (
      widgetTypeWasSwitchedToVertical
      || widgetType === 'vertical'
      && this.state.ask.autoScrollEnabled
      && (newAskOrdersWereAdded || displayedOrderTypeWasSwitched)
    ) {
      this.scrollReversedAskContainerDown();
    }

    if (
      widgetType === 'vertical'
      && newBidOrdersWereAdded
      && this.state.bid.autoScrollEnabled
    ) {
      this.scrollBidContainerUp();
    }

    const askOrders = orderBook.ask;
    const prevAskOrders = prevOrderBook.ask;
    const newAskOrdersWerePlaced = !R.equals(askOrders, prevAskOrders);

    const bidOrders = orderBook.bid;
    const prevBidOrders = prevOrderBook.bid;
    const newBidOrdersWerePlaced = !R.equals(bidOrders, prevBidOrders);

    if (newAskOrdersWerePlaced) {
      const newUserOrderIndex = this.getNewUserOrderIndex(prevAskOrders, askOrders);
      if (newUserOrderIndex !== null) {
        this.scrollToNewUserOrder(newUserOrderIndex, 'ask');
      }
    } else if (newBidOrdersWerePlaced) {
      const newUserOrderIndex = this.getNewUserOrderIndex(prevBidOrders, bidOrders);
      if (newUserOrderIndex !== null) {
        this.scrollToNewUserOrder(newUserOrderIndex, 'bid');
      }
    }
  }

  public render() {
    const {
      settings: { widgetType, displayedOrderType, shouldOpenModalOnPlaceOrderRequest, depthView },
      askTotalAmount, bidTotalAmount, convertQuoteCurrencyToUSDT, currentCurrencyPair, orderBook, baseCurrencyBalance,
      copyOrderToModal, copyOrderToWidget,
    } = this.props;
    return (
      <div className={b()}>
        {widgetType === 'horizontal' && this.renderHorizontalHeader()}
        <OrderBookTable
          askTotalAmount={askTotalAmount}
          bidTotalAmount={bidTotalAmount}
          convertQuoteCurrencyToUSDT={convertQuoteCurrencyToUSDT}
          currentCurrencyPair={currentCurrencyPair}
          displayedOrderType={displayedOrderType}
          shouldOpenModalOnPlaceOrderRequest={shouldOpenModalOnPlaceOrderRequest}
          orderBook={orderBook}
          widgetType={widgetType}
          depthView={depthView}
          bidContainer={this.bidContainer}
          reversedAskContainer={this.reversedAskContainer}
          ordersContainer={this.ordersContainer}
          renderSeparator={this.renderLastPrice}
          amountAccuracy={this.amountAccuracy}
          priceAccuracy={this.priceAccuracy}
          baseCurrencyBalance={baseCurrencyBalance}
          copyOrderToModal={copyOrderToModal}
          copyOrderToWidget={copyOrderToWidget}
        />
      </div>
    );
  }

  private renderHorizontalHeader() {
    const { bidTotalAmount, askTotalAmount } = this.props;
    return (
      <div className={b('header')()}>
        <div className={b('total', { bid: true })()}>
          {floorFloatToFixed(bidTotalAmount, this.amountAccuracy)}
        </div>
        {this.renderLastPrice()}
        <div className={b('total', { ask: true })()}>
          {floorFloatToFixed(askTotalAmount, this.amountAccuracy)}
        </div>
      </div>
    );
  }

  @bind
  private renderLastPrice() {
    const { currentCurrencyPair: { counterCurrency }, settings: { widgetType } } = this.props;
    return (
      <LastPrice
        counterCurrency={counterCurrency}
        accuracy={this.priceAccuracy}
        widgetType={widgetType}
      />
    );
  }

  private switchAutoScrollOrdersMode(container: HTMLElement, eventTarget: Node, orderSide: OrderSide) {
    const orderType: OrderType = orderSide === 'buy' ? 'bid' : 'ask';
    if (container.contains(eventTarget as Node)) {
      this.disableAutoScrollFlag(orderType);
    } else {
      this.setState((prevState) => ({
        ...prevState,
        [orderType]: {
          autoScrollEnabled: true,
        }
      }));
    }
  }

  @bind
  private handleBodyMousedown(event: MouseEvent) {
    if (this.reversedAskContainer.current) {
      this.switchAutoScrollOrdersMode(this.reversedAskContainer.current, event.target as Node, 'sell');
    }

    if (this.bidContainer.current) {
      this.switchAutoScrollOrdersMode(this.bidContainer.current, event.target as Node, 'buy');
    }
  }

  @bind
  @debounce(debounceDelay)
  private handleReversedAskContainerWheel() {
    this.disableAutoScrollFlag('ask');
  }

  @bind
  @debounce(debounceDelay)
  private handleBidContainerWheel() {
    this.disableAutoScrollFlag('bid');
  }

  @bind
  private disableAutoScrollFlag(orderType: OrderType) {
    const { autoScrollEnabled } = this.state[orderType];
    if (autoScrollEnabled) {
      this.setState((prevState) => ({
        ...prevState,
        [orderType]: {
          autoScrollEnabled: false,
        }
      }));
    }
  }

  private scrollReversedAskContainerDown() {
    if (this.reversedAskContainer.current) {
      this.reversedAskContainer.current.scrollTop = this.reversedAskContainer.current.scrollHeight;
    }
  }

  private scrollBidContainerUp() {
    if (this.bidContainer.current) {
      this.bidContainer.current.scrollTop = 0;
    }
  }

  private scrollToNewUserOrder(newUserOrderIndex: number, orderType: OrderType) {
    const { settings: { widgetType }, orderBook } = this.props;
    const scrollToOrder = R.partial(this.scrollToOrder, [newUserOrderIndex, false]);
    const scrollToOrderReversed = R.partial(this.scrollToOrder, [newUserOrderIndex, true]);
    const orders = orderBook[orderType];
    switch (widgetType) {
      case 'vertical':
        if (orderType === 'bid' && this.bidContainer.current) {
          scrollToOrder(orders, this.bidContainer.current);
        } else if (orderType === 'ask' && this.reversedAskContainer.current) {
          scrollToOrderReversed(orders, this.reversedAskContainer.current);
        }
        break;
      case 'horizontal':
        if (this.ordersContainer.current) {
          scrollToOrder(orders, this.ordersContainer.current);
        }
        break;
      default:
        break;
    }
  }

  @bind
  private scrollToOrder(
    orderIndex: number,
    areOrderRowsReversed: boolean,
    orders: IOrderBookOrder[],
    container: HTMLElement,
  ) {
    const { settings: { widgetType } } = this.props;
    const orderRowHeight = (() => {
      switch (widgetType) {
        case 'vertical':
          return container.children[0] ? container.children[0].clientHeight : null;
        case 'horizontal':
          const areBidOrdersExist = container.children[0].children[0];
          if (areBidOrdersExist) {
            return container.children[0].children[0].clientHeight;
          }
          const areAskOrdersExist = container.children[1].children[0];
          if (areAskOrdersExist) {
            return container.children[1].children[0].clientHeight;
          }
          return null;
        default:
          return null;
      }
    })();
    if (orderRowHeight) {
      const orderTopOffset = areOrderRowsReversed
        ? (orders.length - 1 - orderIndex) * orderRowHeight
        : orderIndex * orderRowHeight;
      container.scrollTop = orderTopOffset + orderRowHeight - container.clientHeight / 2;
    }
  }

  private getNewUserOrderIndex(prevOrders: IOrderBookOrder[], orders: IOrderBookOrder[]) {
    const ordersDiff = R.difference(orders, prevOrders);
    const newUserOrder = ordersDiff.find(order => order.isMine);
    return newUserOrder ? orders.indexOf(newUserOrder) : null;
  }

  private addWheelAndScrollEvents() {
    if (this.reversedAskContainer.current) {
      this.reversedAskContainer.current.addEventListener('wheel', this.handleReversedAskContainerWheel,
        { passive: true });
    }
    if (this.bidContainer.current) {
      this.bidContainer.current.addEventListener('wheel', this.handleBidContainerWheel, { passive: true });
    }
  }

  private removeWheelAndScrollEvents() {
    if (this.reversedAskContainer.current) {
      this.reversedAskContainer.current.removeEventListener('wheel', this.handleReversedAskContainerWheel);
    }
    if (this.bidContainer.current) {
      this.bidContainer.current.removeEventListener('wheel', this.handleBidContainerWheel);
    }
  }

  private subscribeToMarket(marketId: string) {
    const fullMarketChannelAddr = `${marketId}@1m`; // interval and periodicity doesnt matter here, take default values
    this.props.openChannel(`Chart.${fullMarketChannelAddr}`);
    this.props.subscribeToTickEvent(`Chart.${fullMarketChannelAddr}`);
  }

  private unsubscribeFromMarket(marketId: string) {
    const fullMarketChannelAddr = `${marketId}@1m`;
    this.props.closeChannel(`Chart.${fullMarketChannelAddr}`);
    this.props.unsubscribeFromTickEvent(`Chart.${fullMarketChannelAddr}`);
  }
}

export { OrderBook, IProps, b as componentClassName };
export default (
  connect(mapState, mapDispatch)(
    i18nConnect(OrderBook),
  )
);
