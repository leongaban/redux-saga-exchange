import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { Dispatch, connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { IAppReduxState } from 'shared/types/app';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { selectors as configSelectors } from 'services/config';
import { selectors as userSelectors } from 'services/user';
import { floorFloatToFixed } from 'shared/helpers/number';
import { IWidgetContentProps, OrderType, IPlaceOrderSettings, IAssetsInfoMap } from 'shared/types/models';
import { transformAssetName } from 'shared/helpers/converters';

import { actions, reduxFormEntries, selectors } from '../../../../redux';
import OrderTypes from '../../../components/OrderTypes/OrderTypes';
import FormWithOrderSideSwitch from '../../../containers/FormWithOrderSideSwitch/FormWithOrderSideSwitch';
import { makePlaceBuyOrderForm, makePlaceSellOrderForm } from '../../../containers/Forms';

import './Content.scss';

interface IDispatchProps {
  placeOrder: typeof actions.placeOrder;
  setSelectedOrderType: typeof actions.setSelectedOrderType;
}

type IOwnProps = IWidgetContentProps<IPlaceOrderSettings>;
type IProps = IOwnProps & IStateProps & IDispatchProps & ITranslateProps;

interface IStateProps {
  baseCurrencyBalance: number;
  counterCurrencyBalance: number;
  selectedOrderType: OrderType;
  assetsInfo: IAssetsInfoMap;
}

function mapState(state: IAppReduxState, { currentCurrencyPair }: IOwnProps): IStateProps {
  const { baseCurrency, counterCurrency } = currentCurrencyPair;
  const balanceDict = userSelectors.selectBalanceDict(state);
  return {
    baseCurrencyBalance: balanceDict[baseCurrency] || 0,
    counterCurrencyBalance: balanceDict[counterCurrency] || 0,
    selectedOrderType: selectors.selectSelectedOrderType(state),
    assetsInfo: configSelectors.selectAssetsInfo(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators({
    placeOrder: actions.placeOrder,
    setSelectedOrderType: actions.setSelectedOrderType,
  },
    dispatch);
}

const b = block('place-order-widget-content');

const PlaceBuyOrderForm = makePlaceBuyOrderForm(reduxFormEntries.placeBuyOrderFormEntry);
const PlaceSellOrderForm = makePlaceSellOrderForm(reduxFormEntries.placeSellOrderFormEntry);

class PlaceOrder extends React.PureComponent<IProps> {

  public render() {
    const { settings: { sidesDisplayMethod } } = this.props;

    switch (sidesDisplayMethod) {
      case 'both-sides':
        return this.renderBothSides();
      case 'single-side-with-swtich':
        return this.renderSingleSideWithSwitch();
    }
  }

  private renderSingleSideWithSwitch() {
    const { currentCurrencyPair } = this.props;
    return (
      <div className={b()}>
        <FormWithOrderSideSwitch
          currentCurrencyPair={currentCurrencyPair}
        />
      </div>
    );

  }

  private renderBothSides() {
    const {
      translate: t, currentCurrencyPair, baseCurrencyBalance, counterCurrencyBalance,
    } = this.props;

    const { selectedOrderType } = this.props;

    const buyFormBalance = this.formatValue(counterCurrencyBalance, true);
    const sellFormBalance = this.formatValue(baseCurrencyBalance, false);

    return (
      <div className={b()}>
        <div className={b('order-types')()}>
          <OrderTypes
            selected={selectedOrderType}
            onChange={this.handleSelectedOrderTypeChange}
          />
        </div>
        <div className={b('forms')()}>
          <div className={b('form')()}>
            <PlaceBuyOrderForm
              balance={buyFormBalance}
              orderType={selectedOrderType}
              translate={t}
              currencyPair={currentCurrencyPair}
            />
          </div>
          <div className={b('form')()}>
            <PlaceSellOrderForm
              balance={sellFormBalance}
              orderType={selectedOrderType}
              translate={t}
              currencyPair={currentCurrencyPair}
            />
          </div>
        </div>
      </div>
    );
  }

  private formatValue(balance: number, isBuy: boolean) {
    const { currentCurrencyPair: { counterCurrency, baseCurrency }, assetsInfo } = this.props;
    const asset = isBuy ? counterCurrency : baseCurrency;
    const accuracy = asset in assetsInfo ? assetsInfo[asset].scale : 2;
    return `${floorFloatToFixed(balance, accuracy)} ${transformAssetName(asset)}`;
  }

  @bind
  private handleSelectedOrderTypeChange(orderType: OrderType) {
    this.props.setSelectedOrderType(orderType);
  }
}

export { IProps, PlaceOrder };
export default (
  connect(mapState, mapDispatch)(
    i18nConnect(PlaceOrder),
  )
);
