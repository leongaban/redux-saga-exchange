import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';

import {
  IHeaderLeftPartWithSettingsProps, IOrderBookSettings, OrderBookWidgetType,
  DisplayedOrderType,
} from 'shared/types/models';
import { notDraggableClassName } from 'shared/constants';
import { Icon } from 'shared/view/elements';

import { actions } from '../../../../redux';
import { DecimalsSelect } from '../../../components';
import './HeaderLeftPart.scss';

interface IActionProps {
  setDecimals: typeof actions.setDecimals;
}

type IProps = IActionProps & IHeaderLeftPartWithSettingsProps<IOrderBookSettings>;

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators(actions, dispatch);
}

const b = block('order-book-header-left-part');

class HeaderLeftPart extends React.PureComponent<IProps> {

  public componentDidMount() {
    const { settings, onSettingsSave, currentCurrencyPair: { priceScale } } = this.props;
    if (settings.decimals === null) {
      onSettingsSave({ decimals: priceScale });
    }
  }

  public render() {
    // TODO get title from IWidget struct;
    const { settings: { widgetType, decimals }, currentCurrencyPair, setDecimals } = this.props;

    return (
      <div className={b()}>
        <div className={b('options')()}>
          <div className={b('widget-types')()}>
            <div
              className={b('switch-button', { property: 'widget-type' })()}
              onClick={this.makeWidgetTypeButtonClickHandler('horizontal')}
            >
              <Icon
                className={b('widget-type-icon', { selected: widgetType === 'horizontal' })()}
                src={require('./img/horizontal-inline.svg')}
              />
            </div>
            <div
              className={b('switch-button', { property: 'widget-type' })()}
              onClick={this.makeWidgetTypeButtonClickHandler('vertical')}
            >
              <Icon
                className={b('widget-type-icon', { selected: widgetType === 'vertical' })()}
                src={require('./img/vertical-inline.svg')}
              />
            </div>
          </div>
          <div className={b('wrapper', { horizontal: widgetType === 'horizontal' })()}>
            {widgetType === 'vertical' && this.renderOrderTypeSelect()}
            <div className={b('decimals-select').mix(notDraggableClassName)()}>
              <DecimalsSelect
                selected={decimals}
                currentCurrencyPair={currentCurrencyPair}
                onSelect={setDecimals}
                onDecimalsSave={this.handleDecimalsSave}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderOrderTypeSelect() {
    const { settings: { displayedOrderType } } = this.props;
    return (
      <div className={b('order-type-buttons')()}>
        <div
          className={b('switch-button', { property: 'displayed-order-type' })()}
          onClick={this.makeDisplayedOrderTypeButtonClickHandler('All')}
        >
          <Icon
            className={b('displayed-order-type-icon', { selected: displayedOrderType === 'All' })()}
            src={require('./img/all-inline.svg')}
          />
        </div>
        <div
          className={b('switch-button', { property: 'displayed-order-type' })()}
          onClick={this.makeDisplayedOrderTypeButtonClickHandler('Bid')}
        >
          <Icon
            className={b('displayed-order-type-icon', { selected: displayedOrderType === 'Bid' })()}
            src={require('./img/bid-inline.svg')}
          />
        </div>
        <div
          className={b('switch-button', { property: 'displayed-order-type' })()}
          onClick={this.makeDisplayedOrderTypeButtonClickHandler('Ask')}
        >
          <Icon
            className={b('displayed-order-type-icon', { selected: displayedOrderType === 'Ask' })()}
            src={require('./img/ask-inline.svg')}
          />
        </div>
      </div>
    );
  }

  @bind
  private makeWidgetTypeButtonClickHandler(widgetType: OrderBookWidgetType) {
    return () => this.props.onSettingsSave({ widgetType });
  }

  @bind
  private makeDisplayedOrderTypeButtonClickHandler(orderType: DisplayedOrderType) {
    return () => this.props.onSettingsSave({ displayedOrderType: orderType });
  }

  @bind
  private handleDecimalsSave(decimals: number) {
    const { onSettingsSave } = this.props;
    onSettingsSave({ decimals });
  }
}

const HeaderLeftPartContainer = connect
  (null, mapDispatch)(HeaderLeftPart);

export default HeaderLeftPartContainer;
