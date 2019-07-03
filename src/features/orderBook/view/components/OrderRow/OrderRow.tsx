import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { ITradeOrder, OrderBookWidgetType } from 'shared/types/models';
import { Tooltip } from 'shared/view/elements';
import { CurrencyConverter } from 'services/miniTickerDataSource/namespace';
import { floorFloatToFixed, divideZeroTail } from 'shared/helpers/number';

import './OrderRow.scss';

interface IOwnProps {
  order: ITradeOrder;
  isMine: boolean;
  orderIndex: number;
  priceAccuracy: number;
  amountAccuracy: number;
  isTotalColumnHidden?: boolean;
  totalAccuracy: number;
  percentage: number;
  convertQuoteCurrencyToUSDT?: CurrencyConverter;
  orderType: 'bid' | 'ask';
  widgetType: OrderBookWidgetType;
  prevOrderPrice?: number;
  onPriceClick?(order: ITradeOrder, orderType: 'bid' | 'ask'): void;
  onVolumeOrTotalClick?(order: ITradeOrder, orderType: 'bid' | 'ask', orderIndex: number): void;
}

type IProps = IOwnProps;

const b = block('order-book-row');

class OrderRow extends React.PureComponent<IProps> {

  public render() {
    const { orderType, percentage, isMine, widgetType } = this.props;

    const isOrderBookHorizontal = widgetType === 'horizontal';
    return (
      <div
        className={b({
          // TODO: look into this modificators & order book styles in general
          'order-type': orderType,
          'with-left-padding': !isMine && (isOrderBookHorizontal && orderType === 'bid' || !isOrderBookHorizontal),
          'with-right-padding': !isMine && isOrderBookHorizontal && orderType === 'ask',
          'vertical': !isOrderBookHorizontal,
          'orientation': widgetType,
        })()}
      >
        {isMine && <div className={b('triangle', { type: isOrderBookHorizontal ? orderType : 'bid' })()} />}
        <div
          className={b('bg', { animate: true, type: orderType })()}
          style={{ width: `${percentage * 100}%` }}
        />
        {this.renderContent()}
      </div>
    );
  }

  private renderContent() {
    const { widgetType, isTotalColumnHidden } = this.props;
    switch (widgetType) {
      case 'horizontal':
        return (
          <React.Fragment>
            {!isTotalColumnHidden && this.renderTotal()}
            {this.renderVolume()}
            {this.renderPrice()}
          </React.Fragment>
        );
      case 'vertical':
        return (
          <React.Fragment>
            {this.renderPrice()}
            {this.renderVolume()}
            {!isTotalColumnHidden && this.renderTotal()}
          </React.Fragment>
        );
      default:
        return null;
    }
  }

  private renderVolume() {
    const { orderType, order, amountAccuracy } = this.props;
    const volume = divideZeroTail(floorFloatToFixed(order.volume, amountAccuracy));
    return (
      <div className={b('volume', { type: orderType })()}>
        {
          !volume
            ? ''
            : (
              <span className={b('value')()} onClick={this.handleVolumeOrTotalClick}>
                <span className={b('value-part')()}>{volume[0]}</span>
                <span className={b('value-part', { 'greyed-out': true })()}>
                  {volume[1]}
                </span>
              </span>
            )
        }
      </div>
    );
  }

  private renderPrice() {
    const { orderType, convertQuoteCurrencyToUSDT } = this.props;

    return (
      <div className={b('price-wrapper', { type: orderType })()}>
        {
          convertQuoteCurrencyToUSDT
            ? this.renderPriceTooltip(convertQuoteCurrencyToUSDT, this.renderPriceValue)
            : this.renderPriceValue()
        }
      </div>
    );
  }

  @bind
  private renderPriceValue() {
    const { orderType, order, priceAccuracy } = this.props;

    const formattedPrice = floorFloatToFixed(order.price, priceAccuracy);
    const { greyedOutPricePart, regularPricePart } = this.splitPriceForGreyingOut(formattedPrice);

    return (
      <div className={b('price', { type: orderType })()}>
        <span className={b('value')()} onClick={this.handlePriceClick}>
          <span className={b('value-part', { 'greyed-out': true })()}>
            {greyedOutPricePart}
          </span>
          <span className={b('value-part')()}>
            {regularPricePart}
          </span>
        </span>
      </div>
    );
  }

  private renderPriceTooltip(
    convertQuoteCurrencyToUSDT: CurrencyConverter,
    renderChildren: () => JSX.Element,
  ) {
    const { orderType, order, widgetType } = this.props;

    const convertedQuoteCurrency = convertQuoteCurrencyToUSDT(order.price);
    const tooltipText = convertedQuoteCurrency
      ? `$ ${convertedQuoteCurrency}`
      : '$ 0';
    const tooltipPosition = (() => {
      if (widgetType === 'horizontal') {
        return orderType === 'bid' ? 'right' : 'left';
      } else {
        return 'right';
      }
    })();

    return (
      <Tooltip text={tooltipText} position={tooltipPosition} withPointer>
        {renderChildren()}
      </Tooltip>
    );
  }

  private splitPriceForGreyingOut(price: string) {
    const { prevOrderPrice } = this.props;
    if (prevOrderPrice) {
      const priceNumbers: string[] = Array.from(price);
      const prevPriceNumbers: string[] = Array.from(String(prevOrderPrice));
      const isGreyingOutNeeded = priceNumbers.slice(0, -2).every((priceNumber: string, index: number) => {
        return priceNumber === prevPriceNumbers[index];
      });
      if (isGreyingOutNeeded) {
        return {
          regularPricePart: price.slice(-2),
          greyedOutPricePart: price.slice(0, -2),
        };
      }
    }
    return {
      regularPricePart: price,
      greyedOutPricePart: '',
    };
  }

  private renderTotal() {
    const { order, orderType, totalAccuracy } = this.props;
    return (
      <div className={b('total', { type: orderType })()} onClick={this.handleVolumeOrTotalClick}>
        {floorFloatToFixed(order.total, totalAccuracy)}
      </div>
    );
  }

  @bind
  private handleVolumeOrTotalClick() {
    const { order, orderType, onVolumeOrTotalClick, orderIndex } = this.props;
    if (onVolumeOrTotalClick) {
      onVolumeOrTotalClick(order, orderType, orderIndex);
    }
  }

  @bind
  private handlePriceClick() {
    const { order, orderType, onPriceClick } = this.props;
    if (onPriceClick) {
      onPriceClick(order, orderType);
    }
  }
}

export default OrderRow;
