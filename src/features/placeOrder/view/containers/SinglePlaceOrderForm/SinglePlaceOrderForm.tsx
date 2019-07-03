import * as React from 'react';
import block from 'bem-cn';
import { Dispatch, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';
import * as R from 'ramda';

import { IAppReduxState } from 'shared/types/app';
import { ICurrencyPair, OrderType, IAssetsInfoMap, OrderSide } from 'shared/types/models';
import { Select } from 'shared/view/elements';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { selectors as userSelectors } from 'services/user';
import { floorFloatToFixed } from 'shared/helpers/number';
import { selectors as configSelectors } from 'services/config';

import * as NS from '../../../namespace';
import { actions, reduxFormEntries, selectors } from '../../../redux';
import OrderTypes from '../../components/OrderTypes/OrderTypes';
import { makePlaceBuyOrderForm, makePlaceSellOrderForm } from '../Forms';
import './SinglePlaceOrderForm.scss';
import { transformAssetName } from 'shared/helpers/converters';

const { placeBuyOrderModalFormEntry, placeSellOrderModalFormEntry } = reduxFormEntries;

interface IDispatchProps {
  reset: typeof actions.reset;
  setVolumeSliderValue: typeof actions.setVolumeSliderValue;
  setSinglePlaceOrderForm: typeof actions.setSinglePlaceOrderForm;
}

type IProps = IStateProps & IDispatchProps & ITranslateProps & IOwnProps;

interface IOwnProps {
  currentCurrencyPair: ICurrencyPair;
  singlePlaceOrderFormKind: NS.SinglePlaceOrderFormKind;
}

interface IStateProps {
  singlePlaceOrderForm: NS.ISinglePlaceOrderForm;
  baseCurrencyBalance: number;
  counterCurrencyBalance: number;
  assetsInfo: IAssetsInfoMap;
}

function mapState(state: IAppReduxState, { currentCurrencyPair, singlePlaceOrderFormKind }: IOwnProps): IStateProps {
  const { baseCurrency, counterCurrency } = currentCurrencyPair;
  const balanceDict = userSelectors.selectBalanceDict(state);
  return {
    singlePlaceOrderForm: selectors.selectSinglePlaceOrderForm(state, singlePlaceOrderFormKind),
    baseCurrencyBalance: balanceDict[baseCurrency] || 0,
    counterCurrencyBalance: balanceDict[counterCurrency] || 0,
    assetsInfo: configSelectors.selectAssetsInfo(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators(actions, dispatch);
}

interface IFormEntries {
  buy: typeof reduxFormEntries.placeBuyOrderModalFormEntry | typeof reduxFormEntries.placeBuyOrderFormEntry;
  sell: typeof reduxFormEntries.placeSellOrderModalFormEntry | typeof reduxFormEntries.placeSellOrderFormEntry;
}

const formEntries: Record<NS.SinglePlaceOrderFormKind, IFormEntries> = {
  modal: {
    buy: reduxFormEntries.placeBuyOrderModalFormEntry,
    sell: reduxFormEntries.placeSellOrderModalFormEntry,
  },
  widget: {
    buy: reduxFormEntries.placeBuyOrderFormEntry,
    sell: reduxFormEntries.placeSellOrderFormEntry,
  },
};

const b = block('single-place-order-form');

const orderTypeSelectOptions: OrderType[] = ['Limit', 'Market'];

class SinglePlaceOrderForm extends React.PureComponent<IProps> {
  private PlaceBuyOrderForm = makePlaceBuyOrderForm(formEntries[this.props.singlePlaceOrderFormKind].buy);
  private PlaceSellOrderForm = makePlaceSellOrderForm(formEntries[this.props.singlePlaceOrderFormKind].sell);

  public componentWillUnmount() {
    const { reset, setVolumeSliderValue, singlePlaceOrderForm } = this.props;
    const formName = singlePlaceOrderForm.orderSide === 'buy'
      ? placeBuyOrderModalFormEntry.name
      : placeSellOrderModalFormEntry.name;
    reset();
    setVolumeSliderValue({ form: formName, value: 0 });
  }

  public render() {
    const { singlePlaceOrderForm: { orderSide, orderType }, translate: t } = this.props;
    return (
      <div className={b()}>
        <div className={b('order-types')()}>
          <OrderTypes
            selected={orderType}
            onChange={this.handleSelectedOrderTypeChange}
          />
        </div>
        <div className={b('m-order-type-field')()}>
          <div className={b('m-order-type-field-label')()}>
            {t('PLACE-ORDER:ORDER-TYPE-FIELD-LABEL')}
          </div>
          <div className={b('m-order-type-field-select')()}>
            <Select<OrderType>
              options={orderTypeSelectOptions}
              onSelect={this.handleSelectedOrderTypeChange}
              selectedOption={orderType}
              optionValueKey={R.identity}
            />
          </div>
        </div>
        <div className={b('form')()}>
          {this.renderForm(orderSide)}
        </div>
      </div>
    );
  }

  @bind
  private renderForm(side: OrderSide) {
    const {
      translate: t, currentCurrencyPair, baseCurrencyBalance, counterCurrencyBalance,
      singlePlaceOrderForm: { orderType },
    } = this.props;
    const { baseCurrency, counterCurrency } = currentCurrencyPair;
    const buyFormBalance = this.formatValue(counterCurrencyBalance, counterCurrency);
    const sellFormBalance = this.formatValue(baseCurrencyBalance, baseCurrency);
    if (side === 'buy') {
      return (
        <this.PlaceBuyOrderForm
          balance={buyFormBalance}
          orderType={orderType}
          translate={t}
          currencyPair={currentCurrencyPair}
        />
      );
    } else {
      return (
        <this.PlaceSellOrderForm
          balance={sellFormBalance}
          orderType={orderType}
          translate={t}
          currencyPair={currentCurrencyPair}
        />
      );
    }
  }

  private formatValue(balance: number, asset: string) {
    const { assetsInfo } = this.props;
    const accuracy = (asset in assetsInfo) ? assetsInfo[asset].scale : 2;
    return `${floorFloatToFixed(balance, accuracy)} ${transformAssetName(asset)}`;
  }

  @bind
  private handleSelectedOrderTypeChange(orderType: OrderType) {
    const { singlePlaceOrderFormKind, setSinglePlaceOrderForm } = this.props;
    setSinglePlaceOrderForm({ formKind: singlePlaceOrderFormKind, placeOrderFormData: { orderType } });
  }
}

export { IProps, SinglePlaceOrderForm };
export default (
  connect(mapState, mapDispatch)(
    i18nConnect(SinglePlaceOrderForm),
  )
);
