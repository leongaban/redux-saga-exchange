import React from 'react';
import { bind } from 'decko';
import block from 'bem-cn';
import { OrderType } from 'shared/types/models';
import { Radio, Icon, Tooltip } from 'shared/view/elements';
import './OrderTypes.scss';
interface IProps {
  selected: OrderType;
  onChange(type: OrderType): void;
}

const b = block('order-types');

export class OrderTypes extends React.PureComponent<IProps> {

  public render() {
    const orderTypes: OrderType[] = ['Market', 'Limit', 'Conditional'];
    return (
      <div className={b()}>
        {orderTypes.map(this.renderRadio)}
      </div>
    );
  }

  @bind
  private renderRadio(x: OrderType, index: number) {
    const { selected } = this.props;
    return (
      <div className={b('radio')()} key={index}>
        <Radio
          disabled={x === 'Conditional'}
          label={x}
          name="market-type"
          checked={x === selected}
          onChange={this.makeRadioChangeHandler(x)}
          tooltip={this.renderIcon(x)}
        />
      </div>
    );
  }

  @bind
  private renderIcon(x: OrderType) {
    switch (x) {
      case 'Conditional':
        return (
          <Tooltip text="This Feature is Coming Soon" position="bottom">
            <Icon className={b('help-icon')()} src={require('./images/help-inline.svg')} />
          </Tooltip>
        );
      case 'Market':
        return (
          <Tooltip
            text="Liquidity may be limited at times, please exercise caution when using Market order"
            position="bottom"
          >
            <Icon className={b('help-icon')()} src={require('./images/exclamation-inline.svg')} />
          </Tooltip>
        );
      default:
        break;
    }
  }

  private makeRadioChangeHandler(x: OrderType) {
    return () => this.props.onChange(x);
  }
}

export default OrderTypes;
