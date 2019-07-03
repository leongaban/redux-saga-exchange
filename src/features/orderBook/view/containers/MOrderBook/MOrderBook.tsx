import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
  IOrderBook, ICurrencyPair, ICopyOrderToWidgetPayload,
} from 'shared/types/models';
import { IAppReduxState } from 'shared/types/app';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { actions as socketsActions } from 'services/sockets';
import { selectors as orderBookDSselectors, OrderBookDataSource } from 'services/orderBookDataSource';
import { selectors as userSelectors } from 'services/user';

import { actions, selectors } from '../../../redux';
import { LastPrice } from '../../containers';
import OrderBookTable from '../../components/OrderBookTable/OrderBookTable';
import { DecimalsSelect } from '../../components';

import './MOrderBook.scss';

interface IStateProps {
  orderBook: IOrderBook;
  askTotalAmount: number;
  bidTotalAmount: number;
  decimals: number | null;
  baseCurrencyBalance: number;
}

interface IActionProps {
  openChannel: typeof socketsActions.openChannel;
  closeChannel: typeof socketsActions.closeChannel;
  subscribeToTickEvent: typeof actions.subscribeToTickEvent;
  unsubscribeFromTickEvent: typeof actions.unsubscribeFromTickEvent;
  setLastPrice: typeof actions.setLastPrice;
  setDecimals: typeof actions.setDecimals;
}

interface IOwnProps {
  currentCurrencyPair: ICurrencyPair;
  copyOrderToWidget(payload: ICopyOrderToWidgetPayload): void;
}

type IProps = IStateProps & IActionProps & ITranslateProps & IOwnProps;

function mapState(state: IAppReduxState, ownProps: IOwnProps): IStateProps {
  const { currentCurrencyPair: { id, baseCurrency } } = ownProps;
  return {
    orderBook: selectors.selectOrderBook(state, id),
    decimals: selectors.selectDecimals(state),
    askTotalAmount: orderBookDSselectors.selectAskTotalAmount(state),
    bidTotalAmount: orderBookDSselectors.selectBidTotalAmount(state),
    baseCurrencyBalance: userSelectors.selectBalanceDict(state)[baseCurrency] || 0,
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    ...actions,
    openChannel: socketsActions.openChannel,
    closeChannel: socketsActions.closeChannel,
  }, dispatch);
}

const b = block('m-order-book');

class MOrderBook extends React.PureComponent<IProps> {

  private get amountAccuracy() {
    return this.props.currentCurrencyPair.amountScale;
  }

  private get priceAccuracy(): number {
    const { decimals, currentCurrencyPair: { priceScale } } = this.props;

    return decimals === null ? priceScale : decimals;
  }

  public componentDidMount() {
    const { currentCurrencyPair } = this.props;
    this.subscribeToMarket(currentCurrencyPair.id);
  }

  public componentWillUnmount() {
    const { currentCurrencyPair } = this.props;
    this.unsubscribeFromMarket(currentCurrencyPair.id);
  }

  public componentDidUpdate(prevProps: IProps) {
    const { currentCurrencyPair: prevCurrencyPair } = prevProps;
    const { currentCurrencyPair, setLastPrice } = this.props;
    if (prevCurrencyPair.id !== currentCurrencyPair.id) {
      this.unsubscribeFromMarket(prevCurrencyPair.id);
      setLastPrice(null);
      setTimeout(() => this.subscribeToMarket(currentCurrencyPair.id), 300);
    }
  }

  public render() {
    const {
      askTotalAmount, bidTotalAmount, decimals, setDecimals, copyOrderToWidget,
      currentCurrencyPair, orderBook, baseCurrencyBalance,
    } = this.props;
    const data: IOrderBook = {
      ask: orderBook.ask.slice(0, 7),
      bid: orderBook.bid.slice(0, 7),
    };
    return (
      <div className={b()}>
        <div className={b('decimals-selector')()}>
          <DecimalsSelect
            selected={decimals}
            currentCurrencyPair={currentCurrencyPair}
            onSelect={setDecimals}
          />
        </div>
        <OrderBookTable
          isTotalColumnHidden
          isCurrencyInHeaderHidden
          askTotalAmount={askTotalAmount}
          bidTotalAmount={bidTotalAmount}
          currentCurrencyPair={currentCurrencyPair}
          displayedOrderType="All"
          widgetType="vertical"
          shouldOpenModalOnPlaceOrderRequest={false}
          baseCurrencyBalance={baseCurrencyBalance}
          orderBook={data}
          depthView={false}
          renderSeparator={this.renderLastPrice}
          amountAccuracy={this.amountAccuracy}
          priceAccuracy={this.priceAccuracy}
          copyOrderToWidget={copyOrderToWidget}
        />
        <OrderBookDataSource currentMarket={currentCurrencyPair.id} />
      </div>
    );
  }

  @bind
  private renderLastPrice() {
    const { currentCurrencyPair: { counterCurrency } } = this.props;
    return (
      <LastPrice
        counterCurrency={counterCurrency}
        accuracy={this.priceAccuracy}
        widgetType="vertical"
      />
    );
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

export { MOrderBook, IProps };
export default (
  connect(mapState, mapDispatch)(
    i18nConnect(MOrderBook),
  )
);
