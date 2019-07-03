import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { IAppReduxState } from 'shared/types/app';
import { transformAssetName } from 'shared/helpers/converters';
import { Radio, Icon, MenuRadio } from 'shared/view/elements';
import { IMenuEntry } from 'shared/view/components';

import { actions, selectors } from '../../../redux';
import { counterCurrencies } from '../../../constants';
import './CounterCurrencyFilters.scss';

interface IStateProps {
  showOnlyFavorites: boolean;
  filteredCounterCurrency: string | null;
}

interface IDispatchProps {
  setShowOnlyFavorites: typeof actions.setShowOnlyFavorites;
  setFilteredCounterCurrency: typeof actions.setFilteredCounterCurrency;
}

interface IOwnProps {
  size: 'middle' | 'small';
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    showOnlyFavorites: selectors.selectShowOnlyFavorites(state),
    filteredCounterCurrency: selectors.selectFilteredCounterCurrency(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IDispatchProps {
  return bindActionCreators({
    setShowOnlyFavorites: actions.setShowOnlyFavorites,
    setFilteredCounterCurrency: actions.setFilteredCounterCurrency,
  }, dispatch);
}

type IProps = IStateProps & IDispatchProps & IOwnProps;

const b = block('counter-currency-filters');

class CounterCurrencyFilters extends React.PureComponent<IProps> {
  private currencies = [counterCurrencies.btc, counterCurrencies.eth, counterCurrencies.tiox];

  private counterCurrencyRadioMenuEntries: IMenuEntry[][] = [
    [{
      content: this.transformAssetName(counterCurrencies.usdt),
      onClick: this.makeCurrencyRadioClickHandler(counterCurrencies.usdt),
    }],
    [{
      content: this.transformAssetName(counterCurrencies.tusd),
      onClick: this.makeCurrencyRadioClickHandler(counterCurrencies.tusd),
    }],
  ];

  public render() {
    const { filteredCounterCurrency, showOnlyFavorites, size } = this.props;
    return (
      <div className={b({ size })()}>
        <div className={b('currencies')()}>
          {this.currencies.map((currency, index) => (
            <div className={b('currency')()} key={currency}>
              <Radio
                name="market-name"
                label={this.transformAssetName(currency)}
                position={this.getTabPosition(index)}
                extent={size}
                readOnly
                checked={filteredCounterCurrency === currency}
                onClick={this.makeCurrencyRadioClickHandler(currency)}
              />
            </div>
          ))}
          <div className={b('currency')()}>
            <MenuRadio
              name="market-name"
              label={this.getMenuRadioLabel()}
              position="right"
              extent={size}
              readOnly
              checked={this.isRadioMenuChecked(filteredCounterCurrency)}
              onClick={this.handleRadioMenuClick}
              menuEntries={this.counterCurrencyRadioMenuEntries}
              menuPosition="left"
            />
          </div>
        </div>
        <div className={b('favorite-radio')()}>
          <Radio
            position="single"
            checked={showOnlyFavorites}
            icon={
              <Icon
                className={b('favorite-icon', { checked: showOnlyFavorites })()}
                src={require('../../img/fav-inline.svg')}
              />
            }
            extent={size}
            onClick={this.handleFavoriteRadioClick}
          />
        </div>
      </div>
    );
  }

  @bind
  private handleFavoriteRadioClick() {
    const { setShowOnlyFavorites, showOnlyFavorites } = this.props;
    setShowOnlyFavorites(!showOnlyFavorites);
  }

  @bind
  private makeCurrencyRadioClickHandler(currency: string) {
    return () => {
      const { setFilteredCounterCurrency, filteredCounterCurrency } = this.props;
      const newFilteredCounterCurrency = filteredCounterCurrency === currency
        ? null
        : currency;
      setFilteredCounterCurrency(newFilteredCounterCurrency);
    };
  }

  @bind
  private handleRadioMenuClick() {
    const { setFilteredCounterCurrency, filteredCounterCurrency } = this.props;
    const newFilteredCounterCurrency = filteredCounterCurrency === null
      ? counterCurrencies.usds
      : (this.isRadioMenuChecked(filteredCounterCurrency) ? null : counterCurrencies.usds);
    setFilteredCounterCurrency(newFilteredCounterCurrency);
  }

  @bind
  private isRadioMenuChecked(filteredCounterCurrency: string | null) {
    return filteredCounterCurrency !== null
      ? [counterCurrencies.usds, counterCurrencies.usdt, counterCurrencies.tusd].includes(filteredCounterCurrency)
      : false;
  }

  private getTabPosition(index: number) {
    const tabPosition = (() => {
      switch (index) {
        case 0:
          return 'left';
        default:
          return 'center';
      }
    })();
    return tabPosition;
  }

  @bind
  private getMenuRadioLabel() {
    const { filteredCounterCurrency } = this.props;
    switch (filteredCounterCurrency) {
      case counterCurrencies.usdt:
      case counterCurrencies.tusd:
      case counterCurrencies.usds:
        return this.transformAssetName(filteredCounterCurrency);
      default:
        return this.transformAssetName(counterCurrencies.usds);
    }
  }

  private transformAssetName(currency: string) {
    return transformAssetName(currency).replace('USDS', 'USD(s)');
  }
}

export default connect(mapState, mapDispatch)(CounterCurrencyFilters);
