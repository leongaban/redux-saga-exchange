import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';

import { IAppReduxState } from 'shared/types/app';
import { OrderSide, ICurrencyPair } from 'shared/types/models';
import { Radio } from 'shared/view/elements';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { ClientDeviceContext } from 'services/config';
import { ClientDeviceType } from 'shared/types/ui';

import * as NS from '../../../namespace';
import { actions, selectors } from '../../../redux';
import SinglePlaceOrderForm from '../SinglePlaceOrderForm/SinglePlaceOrderForm';
import './FormWithOrderSideSwitch.scss';

interface IStateProps {
  singlePlaceOrderForm: NS.ISinglePlaceOrderForm;
}

interface IActionProps {
  setSinglePlaceOrderForm: typeof actions.setSinglePlaceOrderForm;
}

interface IOwnProps {
  currentCurrencyPair: ICurrencyPair;
}

type IProps = IOwnProps & IStateProps & IActionProps & ITranslateProps;

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators(actions, dispatch);
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    singlePlaceOrderForm: selectors.selectSinglePlaceOrderForm(state, 'widget'),
  };
}

const b = block('form-with-order-side-switch');

const orderSideI18nKeys: Record<OrderSide, string> = {
  buy: 'PLACE-ORDER:BUY-RADIO-LABEL',
  sell: 'PLACE-ORDER:SELL-RADIO-LABEL',
};

class FormWithOrderSideSwitch extends React.PureComponent<IProps> {

  public render() {

    const { currentCurrencyPair } = this.props;

    return (
      <ClientDeviceContext.Consumer >
        {device => (
          <div className={b()}>
            <div className={b('order-side-radios')()}>
              {this.renderOrderSideRadio('buy', 'left', this.getRadioExtent(device))}
              {this.renderOrderSideRadio('sell', 'right', this.getRadioExtent(device))}
            </div>
            <SinglePlaceOrderForm
              currentCurrencyPair={currentCurrencyPair}
              singlePlaceOrderFormKind="widget"
            />
          </div>
        )}
      </ClientDeviceContext.Consumer>
    );
  }

  @bind
  private renderOrderSideRadio(
    x: OrderSide,
    position: 'left' | 'right',
    extent: 'small' | 'large'
  ) {
    const { singlePlaceOrderForm, translate: t } = this.props;
    return (
      <div className={b('order-side-radio')()} key={x}>
        <Radio
          label={t(orderSideI18nKeys[x])}
          labelClassNameMix={b('order-side-label')()}
          name="order-side"
          position={position}
          extent={extent}
          checked={x === singlePlaceOrderForm.orderSide}
          onChange={this.makeOrderSideRadioChangeHandler(x)}
          colorsSet={x}
        />
      </div>
    );
  }

  private makeOrderSideRadioChangeHandler(orderSide: OrderSide) {
    return () => this.props.setSinglePlaceOrderForm({
      formKind: 'widget',
      placeOrderFormData: { orderSide },
    });
  }

  private getRadioExtent(device: ClientDeviceType) {
    return device === 'mobile' ? 'small' : 'large';
  }

}

export default (
  connect(mapState, mapDispatch)(
    i18nConnect(
      FormWithOrderSideSwitch
    )));
