import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import * as R from 'ramda';

import {
  IOrderBook, ITradeOrder, OrderBookWidgetType, DisplayedOrderType, ICurrencyPair, IOrderBookOrder,
  ICopyOrderToModalPayload, ICopyOrderToWidgetPayload,
} from 'shared/types/models';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { CurrencyConverter } from 'services/miniTickerDataSource/namespace';
import { transformAssetName } from 'shared/helpers/converters';
import { floorFloatToFixed } from 'shared/helpers/number';

import OrderRow from '../../components/OrderRow/OrderRow';

import './OrderBookTable.scss';

interface IOwnProps {
  widgetType: OrderBookWidgetType;
  displayedOrderType: DisplayedOrderType;
  shouldOpenModalOnPlaceOrderRequest: boolean;
  orderBook: IOrderBook;
  askTotalAmount: number;
  bidTotalAmount: number;
  baseCurrencyBalance: number;
  amountAccuracy: number;
  priceAccuracy: number;
  isTotalColumnHidden?: boolean; // TODO later remove it
  isCurrencyInHeaderHidden?: boolean;
  depthView: boolean;
  currentCurrencyPair: ICurrencyPair;
  ordersContainer?: React.RefObject<HTMLDivElement>;
  reversedAskContainer?: React.RefObject<HTMLDivElement>;
  bidContainer?: React.RefObject<HTMLDivElement>;
  convertQuoteCurrencyToUSDT?: CurrencyConverter;
  renderSeparator(): JSX.Element;
  copyOrderToModal?(payload: ICopyOrderToModalPayload): void;
  copyOrderToWidget?(payload: ICopyOrderToWidgetPayload): void;

}

type IProps = ITranslateProps & IOwnProps;

const b = block('order-book-table');

class OrderBookTable extends React.PureComponent<IProps> {

  public render() {
    const { widgetType } = this.props;
    return (
      <div className={b({ vertical: widgetType === 'vertical' })()}>
        {this.renderTableHeader()}
        {this.renderTableContent()}
      </div>
    );
  }

  private renderTableHeader() {
    const {
      translate: t, currentCurrencyPair: { baseCurrency, counterCurrency },
      widgetType, isTotalColumnHidden,
    } = this.props;
    const tableHeaders = (() => {
      switch (widgetType) {
        case 'horizontal':
          return (
            <React.Fragment>
              <div className={b('headers')()}>
                {
                  !isTotalColumnHidden && (
                    <div className={b('header', { bid: true })()}>
                      {t('ORDER-BOOK:COLUMN-TOTAL', { asset: this.getAssetForHeader(counterCurrency) })}
                    </div>
                  )
                }
                <div className={b('header', { bid: true })()}>
                  {t('ORDER-BOOK:COLUMN-VOLUME', { asset: this.getAssetForHeader(baseCurrency) })}
                </div>
                <div className={b('header', { bid: true })()}>
                  {t('ORDER-BOOK:COLUMN-BID-PRICE', { asset: this.getAssetForHeader(counterCurrency) })}
                </div>
              </div>
              <div className={b('headers')()}>
                {
                  !isTotalColumnHidden && (
                    <div className={b('header', { ask: true })()}>
                      {t('ORDER-BOOK:COLUMN-ASK-PRICE', { asset: this.getAssetForHeader(counterCurrency) })}
                    </div>
                  )
                }
                <div className={b('header', { ask: true })()}>
                  {t('ORDER-BOOK:COLUMN-VOLUME', { asset: this.getAssetForHeader(baseCurrency) })}
                </div>
                <div className={b('header', { ask: true })()}>
                  {t('ORDER-BOOK:COLUMN-TOTAL', { asset: this.getAssetForHeader(counterCurrency) })}
                </div>
              </div>
            </React.Fragment>
          );
        case 'vertical':
          return (
            <React.Fragment>
              <div className={b('header')()}>
                {t('ORDER-BOOK:COLUMN-PRICE', { asset: this.getAssetForHeader(counterCurrency) })}
              </div>
              <div className={b('header')()}>
                {t('ORDER-BOOK:COLUMN-VOLUME', { asset: this.getAssetForHeader(baseCurrency) })}
              </div>
              {
                !isTotalColumnHidden && (
                  <div className={b('header')()}>
                    {t('ORDER-BOOK:COLUMN-TOTAL', { asset: this.getAssetForHeader(counterCurrency) })}
                  </div>
                )
              }
            </React.Fragment>
          );
        default:
          return null;
      }
    })();

    return (
      <div className={b('header-row')()}>
        {tableHeaders}
      </div>
    );
  }

  private renderTableContent() {
    const {
      orderBook: { ask, bid }, askTotalAmount, bidTotalAmount,
      widgetType, displayedOrderType, renderSeparator,
      bidContainer, reversedAskContainer, ordersContainer,
    } = this.props;

    const tableContent = (() => {
      const bidRows = (
        <section className={b('content-section')()} ref={bidContainer}>
          {bid.map(this.makeRowRenderer('bid', bidTotalAmount, bid))}
        </section>
      );
      const askRows = (
        <section className={b('content-section')()} >
          {ask.map(this.makeRowRenderer('ask', askTotalAmount, ask))}
        </section>
      );
      const askRowsReversed = (
        <section className={b('content-section', { reversed: true })()}>
          <div
            className={b('content-section-inner')()}
            ref={reversedAskContainer}
          >
            {ask.map(this.makeRowRenderer('ask', askTotalAmount, ask)).reverse()}
          </div>
        </section>
      );
      switch (widgetType) {
        case 'horizontal':
          return (
            <React.Fragment>
              {bidRows}
              {askRows}
            </React.Fragment>
          );
        case 'vertical':
          switch (displayedOrderType) {
            case 'Bid':
              return (
                <React.Fragment>
                  {renderSeparator()}
                  {bidRows}
                </React.Fragment>
              );
            case 'Ask':
              return (
                <React.Fragment>
                  {askRowsReversed}
                  {renderSeparator()}
                </React.Fragment>
              );
            case 'All':
              return (
                <React.Fragment>
                  {askRowsReversed}
                  {renderSeparator()}
                  {bidRows}
                </React.Fragment>
              );
            default:
              return null;
          }
        default:
          return null;
      }
    })();
    return (
      <div className={b('content')()} ref={ordersContainer}>
        {tableContent}
      </div>
    );
  }

  @bind
  private makeRowRenderer(type: 'bid' | 'ask', total: number, orders: IOrderBookOrder[]) {
    const {
      convertQuoteCurrencyToUSDT, widgetType, orderBook, isTotalColumnHidden, depthView,
      amountAccuracy, priceAccuracy, currentCurrencyPair: { priceScale },
    } = this.props;
    const calculatePercentage = depthView
      ? this.makeDepthPercentageCalculator(orders)
      : this.makeAveragePercentageCalculator(total, orders.length);
    return (order: IOrderBookOrder, orderIndex: number) => {
      const percentage = calculatePercentage(order);
      // Key has to be multiple.
      // price-unique for each order, if the order volume changes, we must redraw the line.
      const key = order.price + '_' + order.volume;
      const prevOrder = orderBook[type][orderIndex - 1];
      return (
        <OrderRow
          key={key}
          prevOrderPrice={prevOrder && prevOrder.price}
          order={order}
          orderIndex={orderIndex}
          orderType={type}
          percentage={percentage}
          isTotalColumnHidden={isTotalColumnHidden}
          isMine={order.isMine}
          totalAccuracy={priceScale}
          amountAccuracy={amountAccuracy}
          priceAccuracy={priceAccuracy}
          widgetType={widgetType}
          convertQuoteCurrencyToUSDT={convertQuoteCurrencyToUSDT}
          onPriceClick={this.handleOrderRowPriceClick}
          onVolumeOrTotalClick={this.handleOrderRowVolumeOrTotalClick}
        />
      );
    };
  }

  @bind
  private getAssetForHeader(asset: string) {
    const { isCurrencyInHeaderHidden } = this.props;
    return !isCurrencyInHeaderHidden ? transformAssetName(asset.toUpperCase()) : '';
  }

  private makeAveragePercentageCalculator(total: number, ordersLength: number) {
    const average = total / ordersLength; // this is 100%
    return (order: IOrderBookOrder) => {
      const raw = order.volume / average;
      const percentage = raw >= 1 ? 1 : raw; // If great or equal than 100% -> 100%, otherwise - persentage
      return percentage;
    };
  }

  private makeDepthPercentageCalculator(orders: IOrderBookOrder[]) {
    const runningTotal = R.sum(orders.map(x => x.total));
    let totalSum = 0;
    return (order: IOrderBookOrder) => {
      totalSum += order.total;
      const percentage = totalSum / runningTotal;
      return percentage;
    };
  }

  @bind
  private handleOrderRowPriceClick(order: ITradeOrder, orderType: 'bid' | 'ask') {
    const {
      copyOrderToModal, copyOrderToWidget, shouldOpenModalOnPlaceOrderRequest, priceAccuracy,
    } = this.props;
    const orderSide = orderType === 'bid' ? 'sell' : 'buy';
    if (shouldOpenModalOnPlaceOrderRequest) {
      copyOrderToModal && copyOrderToModal({
        orderSide,
        price: floorFloatToFixed(order.price, priceAccuracy),
      });
    } else {
      copyOrderToWidget && copyOrderToWidget({
        orderSide,
        sell: {
          price: floorFloatToFixed(order.price, priceAccuracy),
        },
        buy: {
          price: floorFloatToFixed(order.price, priceAccuracy),
        },
      });
    }
  }

  @bind
  private handleOrderRowVolumeOrTotalClick(order: ITradeOrder, orderType: 'bid' | 'ask', orderIndex: number) {
    const {
      copyOrderToModal,
      copyOrderToWidget,
      shouldOpenModalOnPlaceOrderRequest,
      baseCurrencyBalance,
      amountAccuracy, priceAccuracy,
    } = this.props;
    const orderSide = orderType === 'bid' ? 'sell' : 'buy';
    const volume = Math.min(this.getVolumeSum(orderIndex, orderType), baseCurrencyBalance);
    if (shouldOpenModalOnPlaceOrderRequest) {
      copyOrderToModal && copyOrderToModal({
        orderSide,
        price: floorFloatToFixed(order.price, priceAccuracy),
        volume: floorFloatToFixed(volume, amountAccuracy),
      });
    } else {
      copyOrderToWidget && copyOrderToWidget({
        orderSide,
        buy: {
          volume: orderSide === 'buy' ? floorFloatToFixed(volume, amountAccuracy) : void 0,
          price: floorFloatToFixed(order.price, priceAccuracy),
        },
        sell: {
          volume: orderSide === 'sell' ? floorFloatToFixed(volume, amountAccuracy) : void 0,
          price: floorFloatToFixed(order.price, priceAccuracy),
        }
      });
    }
  }

  private getVolumeSum(orderIndex: number, orderType: 'bid' | 'ask'): number {
    const { orderBook } = this.props;
    return orderBook[orderType]
      .slice(0, orderIndex + 1)
      .reduce((acc, order) => acc + order.volume, 0);
  }
}

export { OrderBookTable, IProps, b as componentClassName };
export default (
  i18nConnect(OrderBookTable)
);
