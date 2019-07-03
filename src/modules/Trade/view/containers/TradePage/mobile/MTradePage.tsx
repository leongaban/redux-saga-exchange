import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { featureConnect } from 'core';
import * as features from 'features';
import { IAppReduxState } from 'shared/types/app';
import { ICurrencyPair } from 'shared/types/models';
import { Action } from 'shared/types/redux';
import { ISwitchableMobileContentProps } from 'shared/types/ui';
import { selectors as configSelectors, actions as configActions } from 'services/config';

import { MTradeClassicTab } from '../../../../namespace';
import './MTradePage.scss';

interface IFeatureProps {
  placeOrderFeatureEntry: features.placeOrder.Entry;
  exchangeRatesFeatureEntry: features.exchangeRates.Entry;
  orderBookFeatureEntry: features.orderBook.Entry;
}

interface IActionProps {
  mSetCurrentCurrencyPairID: typeof configActions.mSetCurrentCurrencyPairID;
  copyOrderToWidget: Action<features.placeOrder.namespace.ICopyOrderToWidget>;
}

interface IStateProps {
  mCurrencyCurrencyPair: ICurrencyPair | null;
}

type IProps = IFeatureProps & IStateProps & IActionProps & ISwitchableMobileContentProps<MTradeClassicTab>;

const b = block('m-trade-page');

function mapState(state: IAppReduxState): IStateProps {
  return {
    mCurrencyCurrencyPair: configSelectors.mSelectCurrentCurrencyPair(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>, ownProps: IFeatureProps): IActionProps {
  return bindActionCreators({
    ...configActions,
    ...ownProps.placeOrderFeatureEntry.actions,
  }, dispatch);
}

class MTradePage extends React.PureComponent<IProps> {

  public componentDidMount() {
    const pairID = this.props.queryParams.pair;
    if (pairID) {
      this.props.mSetCurrentCurrencyPairID(pairID);
    }
  }

  public render() {
    const {
      placeOrderFeatureEntry, exchangeRatesFeatureEntry, orderBookFeatureEntry,
      mCurrencyCurrencyPair, copyOrderToWidget,
    } = this.props;

    return mCurrencyCurrencyPair && (
      <div className={b()}>
        <div className={b('left-panel')()}>
          <exchangeRatesFeatureEntry.containers.MExchangeRatesToggle currentCurrencyPair={mCurrencyCurrencyPair} />
          <div className={b('place-order')()}>
            <placeOrderFeatureEntry.containers.FormWithOrderSideSwitch
              currentCurrencyPair={mCurrencyCurrencyPair}
            />
          </div>
        </div>
        <div className={b('order-book')()}>
          <orderBookFeatureEntry.containers.MOrderBook
            currentCurrencyPair={mCurrencyCurrencyPair}
            copyOrderToWidget={copyOrderToWidget}
          />
        </div>
      </div>
    );
  }
}

export default (
  featureConnect({
    placeOrderFeatureEntry: features.placeOrder.loadEntry,
    exchangeRatesFeatureEntry: features.exchangeRates.loadEntry,
    orderBookFeatureEntry: features.orderBook.loadEntry,
  })(
    connect(mapState, mapDispatch)(
      MTradePage
    )));
