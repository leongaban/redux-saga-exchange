import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { createSelector } from 'reselect';

import { ICurrencyPair, ITradeOrders, OrderType } from 'shared/types/models';
import { i18nConnect, ITranslateProps } from 'services/i18n';
import { floorFloatToFixed } from 'shared/helpers/number';

import { getBuyFormPurchasedAssetVolume, getSellFormPurchasedAssetVolume, calculateOrderFee } from './helpers';
import { FormType, FeeType, PurchasedAssetVolume } from '../../../namespace';
import './OrderInfo.scss';

interface IOwnProps {
  currencyPair: ICurrencyPair;
  formType: FormType;
  volume: number;
  price: number;
  orders: ITradeOrders;
  orderType: OrderType;
}

interface IState {
  isFeeListOpen: boolean;
}

type IProps = IOwnProps & ITranslateProps;

const b = block('order-info');

class OrderInfo extends React.PureComponent<IProps> {
  public state: IState = {
    isFeeListOpen: false,
  };

  private feeScale: number = 8;

  private get feeCurrency() {
    const { formType, currencyPair: { baseCurrency, counterCurrency } } = this.props;
    return formType === 'buy' ? baseCurrency : counterCurrency;
  }

  private selectTakerOrders = createSelector(
    (props: IProps) => props.orders,
    (props: IProps) => props.price,
    (props: IProps) => props.formType,
    (orders, placedOrderPrice, formType) => {
      return formType === 'buy'
        ? orders.ask.filter(x => x.price <= placedOrderPrice)
        : orders.bid.filter(x => x.price >= placedOrderPrice);
    },
  );

  private selectPurchasedAssetVolume = createSelector(
    this.selectTakerOrders,
    (props: IProps) => props.formType,
    (props: IProps) => props.price,
    (props: IProps) => props.volume,
    (takerOrders, formType, placedOrderPrice, placedOrderVolume) => {
      return formType === 'buy'
        ? getBuyFormPurchasedAssetVolume(takerOrders, placedOrderVolume)
        : getSellFormPurchasedAssetVolume(takerOrders, placedOrderPrice, placedOrderVolume);
    },
  );

  private selectTakerFee = createSelector(
    this.selectPurchasedAssetVolume,
    (props: IProps) => props.currencyPair,
    (purchasedAssetVolume, currencyPair) => {
      return calculateOrderFee('taker', purchasedAssetVolume.taker, currencyPair);
    },
  );

  private selectMakerFee = createSelector(
    this.selectPurchasedAssetVolume,
    (props: IProps) => props.currencyPair,
    (purchasedAssetVolume, currencyPair) => {
      return calculateOrderFee('maker', purchasedAssetVolume.maker, currencyPair);
    },
  );

  private get takerFee(): number {
    return this.selectTakerFee(this.props);
  }

  private get makerFee(): number {
    return this.selectMakerFee(this.props);
  }
  private get purchasedAssetVolume(): PurchasedAssetVolume {
    return this.selectPurchasedAssetVolume(this.props);
  }

  public render() {
    const { orderType, translate: t } = this.props;
    const { isFeeListOpen } = this.state;
    const totalFee = floorFloatToFixed(this.takerFee + this.makerFee, this.feeScale);
    return (
      <div className={b()}>
        <div className={b('upper-part')()}>
          <div className={b('fee-list-title')()} onClick={this.handleFeeListTitleClick}>
            {`${t('ORDERS:PLACE-ORDER-FORM:FEE-LABEL')} ≈ ${totalFee} ${this.feeCurrency}`}
            <div className={b('fee-list-toggle', { open: isFeeListOpen })()} />
          </div>
          {orderType !== 'Market' && this.renderTotalPrice()}
        </div>
        <div className={b('fee-list-values', { hidden: !isFeeListOpen })()}>
          {this.renderFeeValue('taker')}
          {this.renderFeeValue('maker')}
        </div>
      </div>
    );
  }

  private renderTotalPrice() {
    const { translate: t, currencyPair: { counterCurrency, priceScale }, volume, price } = this.props;
    const total = floorFloatToFixed(volume * price, priceScale);
    return (
      <div className={b('total-price')()}>
        {`${t('ORDERS:PLACE-ORDER-FORM:TOTAL-PRICE-LABEL')} ≈ ${total} ${counterCurrency}`}
      </div>
    );
  }

  private renderFeeValue(feeType: FeeType) {
    const feeLabel = this.getFeeLabel(feeType);
    return (
      <div className={b('fee-value')()}>
        <span className={b('fee-label')()}>{feeLabel} ≈ </span>
        {this.renderOrderFeeDetails(feeType)}
      </div>
    );
  }

  private getFeeLabel(feeType: FeeType): string {
    const { translate: t } = this.props;
    return t(`ORDERS:PLACE-ORDER-FORM:${feeType.toUpperCase()}-FEE-PRICE-LABEL`);
  }

  private renderOrderFeeDetails(feeType: FeeType) {
    const currencyFee = this.getCurrencyFee(feeType);
    const valueForCalculatingOrderFee = this.purchasedAssetVolume[feeType];
    const fixedValueForCalculatingOrderFee = floorFloatToFixed(valueForCalculatingOrderFee, this.feeScale);
    const orderFee = feeType === 'taker' ? this.takerFee : this.makerFee;
    const fixedOrderFee = floorFloatToFixed(orderFee, this.feeScale);

    return (
      <span className={b('order-fee-details')()}>
        <span className={b('order-fee')()}>
          {`${fixedOrderFee} `}
        </span>
        <span className={b('order-fee-calculation')()}>
          {`(${fixedValueForCalculatingOrderFee} x ${currencyFee}) `}
        </span>
        <span className={b('fee-currency')()}>
          {this.feeCurrency}
        </span>
      </span>
    );
  }

  private getCurrencyFee(feeType: FeeType): number {
    const { currencyPair: { makerFee, takerFee } } = this.props;
    return feeType === 'taker' ? takerFee : makerFee;
  }

  @bind
  private handleFeeListTitleClick() {
    this.setState((prevState: IState) => ({ isFeeListOpen: !prevState.isFeeListOpen }));
  }
}

export default i18nConnect(OrderInfo);
