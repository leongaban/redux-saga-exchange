import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { bind } from 'decko';
import { bindActionCreators, Dispatch } from 'redux';

import { IAppReduxState } from 'shared/types/app';
import { IExchangeRate, ICurrencyPair } from 'shared/types/models';
import { Icon } from 'shared/view/elements';
import { selectors as miniTickerDSSelectors } from 'services/miniTickerDataSource';
import { CurrencyConverter } from 'services/miniTickerDataSource/namespace';
import { floorFloatToFixed } from 'shared/helpers/number';

import { selectors, actions } from '../../../redux';
import { MExchangeRatesToggle } from '../';

import './MCurrentMarketInfo.scss';

interface IOwnProps {
  currentCurrencyPair: ICurrencyPair;
}

interface IStateProps {
  convertQuoteCurrencyToUSDT: CurrencyConverter;
  favorites: string[];
  currentMarketMiniTick?: IExchangeRate;
}

interface IDispatchProps {
  toggleMarketFavoriteStatus: typeof actions.toggleMarketFavoriteStatus;
}

type IProps = IStateProps & IDispatchProps & IOwnProps;

function mapState(state: IAppReduxState, { currentCurrencyPair }: IOwnProps): IStateProps {
  return {
    currentMarketMiniTick: miniTickerDSSelectors.selectCurrentMarketTick(state, currentCurrencyPair.id),
    convertQuoteCurrencyToUSDT: miniTickerDSSelectors.selectQuoteCurrencyToUSDTConverter(
      state, currentCurrencyPair.counterCurrency
    ),
    favorites: selectors.selectFavorites(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IDispatchProps {
  return bindActionCreators({
    toggleMarketFavoriteStatus: actions.toggleMarketFavoriteStatus,
  }, dispatch);
}

const b = block('m-current-market-info');

class MCurrentMarketInfo extends React.PureComponent<IProps> {
  public render() {
    const {
      currentCurrencyPair,
      currentMarketMiniTick,
      convertQuoteCurrencyToUSDT,
      favorites,
    } = this.props;
    const { priceScale, id: market } = currentCurrencyPair;
    return (
      <div className={b()}>
        <div className={b('market')()}>
          <MExchangeRatesToggle currentCurrencyPair={currentCurrencyPair} />
          {currentMarketMiniTick && (
            <div className={b('current-price-container')()}>
              <span className={b('current-price')()}>
                {floorFloatToFixed(currentMarketMiniTick.current, priceScale)}
              </span>
              <span className={b('current-price', { 'in-usdt': true })()}>
                {`$${convertQuoteCurrencyToUSDT(currentMarketMiniTick.current)}`}
              </span>
            </div>
          )}
        </div>
        <div className={b('favorite')()} onClick={this.handleFavoriteClick}>
          <Icon
            className={b('favorite-icon', { checked: R.contains(market, favorites) })()}
            src={require('../../img/fav-inline.svg')}
          />
        </div>
      </div>
    );
  }

  @bind
  private handleFavoriteClick() {
    const { currentCurrencyPair: { id: market }, toggleMarketFavoriteStatus } = this.props;
    toggleMarketFavoriteStatus(market);
  }
}

export { MCurrentMarketInfo };
export default connect(mapState, mapDispatch)(MCurrentMarketInfo);
