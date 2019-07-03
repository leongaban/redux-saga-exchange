import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { featureConnect } from 'core';
import * as features from 'features';
import { Button } from 'shared/view/elements';
import { Action } from 'shared/types/redux';
import { OrderSide, ICurrencyPair } from 'shared/types/models';
import { ISwitchableMobileContentProps } from 'shared/types/ui';
import { IAppReduxState } from 'shared/types/app';
import { i18nConnect, ITranslateProps } from 'services/i18n';
import { selectors as configSelectors } from 'services/config';

import { MTradeClassicTab } from '../../../namespace';
import './MCharts.scss';

interface IFeatureProps {
  stockChartFeatureEntry: features.stockChart.Entry;
  placeOrderFeatureEntry: features.placeOrder.Entry;
  exchangeRatesFeatureEntry: features.exchangeRates.Entry;
  tradeHistoryFeatureEntry: features.tradeHistory.Entry;
}

interface IActionProps {
  setSinglePlaceOrderForm: Action<features.placeOrder.namespace.ISetSinglePlaceOrderForm>;
}

function mapDispatch(dispatch: Dispatch<any>, ownProps: IFeatureProps): IActionProps {
  return bindActionCreators(ownProps.placeOrderFeatureEntry.actions, dispatch);
}

type IProps = IFeatureProps & IStateProps & IActionProps & ITranslateProps &
  ISwitchableMobileContentProps<MTradeClassicTab>;

interface IStateProps {
  mCurrentCurrencyPair: ICurrencyPair | null;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    mCurrentCurrencyPair: configSelectors.mSelectCurrentCurrencyPair(state),
  };
}

const b = block('m-charts');

class MCharts extends React.PureComponent<IProps> {
  public render() {
    const {
      stockChartFeatureEntry, exchangeRatesFeatureEntry, tradeHistoryFeatureEntry, mCurrentCurrencyPair,
      translate: t,
    } = this.props;

    return mCurrentCurrencyPair && (
      <div className={b()}>
        <div className={b('current-market-info')()}>
          <exchangeRatesFeatureEntry.containers.MCurrentMarketInfo currentCurrencyPair={mCurrentCurrencyPair} />
        </div>
        <stockChartFeatureEntry.containers.MCandleChart currentCurrencyPair={mCurrentCurrencyPair} />
        <div className={b('trade-history')()}>
          <tradeHistoryFeatureEntry.containers.MTradeHistory currentCurrencyPair={mCurrentCurrencyPair} />
        </div>
        <div className={b('place-order-buttons')()}>
          <div className={b('place-order-button')()}>
            <Button color="green" onClick={this.makePlaceOrderButtonClickHandler('buy')}>
              {t('TRADE-MODULE:BUY-BUTTON-LABEL', { currency: mCurrentCurrencyPair.baseCurrency })}
            </Button>
          </div>
          <div className={b('place-order-button')()} onClick={this.makePlaceOrderButtonClickHandler('sell')}>
            <Button color="red">
              {t('TRADE-MODULE:SELL-BUTTON-LABEL', { currency: mCurrentCurrencyPair.baseCurrency })}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  private makePlaceOrderButtonClickHandler(orderSide: OrderSide) {
    const { setSinglePlaceOrderForm, onTabSwitch } = this.props;
    return () => {
      setSinglePlaceOrderForm({ formKind: 'widget', placeOrderFormData: { orderSide } });
      onTabSwitch('trade');
    };
  }

}

export default (
  featureConnect({
    stockChartFeatureEntry: features.stockChart.loadEntry,
    placeOrderFeatureEntry: features.placeOrder.loadEntry,
    exchangeRatesFeatureEntry: features.exchangeRates.loadEntry,
    tradeHistoryFeatureEntry: features.tradeHistory.loadEntry,
  })(
    i18nConnect(
      connect(mapState, mapDispatch)(
        MCharts
      ))));
