import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { transformAssetName } from 'shared/helpers/converters';
import { ICurrencyPair } from 'shared/types/models';

import { MExchangeRates } from '../';
import './MExchangeRatesToggle.scss';

interface IOwnProps {
  currentCurrencyPair: ICurrencyPair;
}

type IProps = IOwnProps;

interface IState {
  isExchangeRatesTableOpen: boolean;
}

const b = block('m-exchange-rates-toggle');

class MExchangeRatesToggle extends React.PureComponent<IProps> {
  public state: IState = {
    isExchangeRatesTableOpen: false,
  };

  public render() {
    const { currentCurrencyPair } = this.props;
    const { isExchangeRatesTableOpen } = this.state;
    return (
      <div className={b()}>
        <div className={b('current-market')()} onClick={this.handleCurrentMarketClick}>
          {transformAssetName(currentCurrencyPair.id.replace('_', '/'))}
        </div>
        <div className={b('exchange-rates', { open: isExchangeRatesTableOpen })()}>
          <MExchangeRates
            currentCurrencyPair={currentCurrencyPair}
            onMarketSelect={this.handleMarketSelect}
            onCloseButtonClick={this.handleExchangeRatesCloseButtonClick}
          />
        </div>
      </div>
    );
  }

  private closeExchangeRates() {
    this.setState(() => ({ isExchangeRatesTableOpen: false }));
  }

  @bind
  private handleCurrentMarketClick() {
    this.setState(() => ({ isExchangeRatesTableOpen: true }));
  }

  @bind
  private handleExchangeRatesCloseButtonClick() {
    this.closeExchangeRates();
  }

  @bind
  private handleMarketSelect() {
    this.closeExchangeRates();
  }
}

export default MExchangeRatesToggle;
