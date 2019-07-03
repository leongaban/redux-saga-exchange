import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { transformAssetName } from 'shared/helpers/converters';
import { Icon, Input } from 'shared/view/elements';
import { MTable } from 'shared/view/components';
import { IMTableColumn } from 'shared/types/ui';
import { IAppReduxState } from 'shared/types/app';
import { IExchangeRate, ICurrencyPair } from 'shared/types/models';
import { floorFloatToFixed } from 'shared/helpers/number';
import { actions as configActions } from 'services/config';

import { RateCell } from '../../../components';
import { CounterCurrencyFilters } from '../..';
import { actions } from './../../../../redux';
import { IStateProps, mapState } from '../shared';
import './MExchangeRates.scss';

interface IOwnProps {
  currentCurrencyPair: ICurrencyPair;
  onCloseButtonClick(): void;
  onMarketSelect?(): void;
}

interface IDispatchProps {
  loadFavorites: typeof actions.loadFavorites;
  setSearchValue: typeof actions.setSearchValue;
  mSetCurrentCurrencyPairID: typeof configActions.mSetCurrentCurrencyPairID;
}

type IProps = IStateProps & IOwnProps & IDispatchProps;

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IDispatchProps {
  return bindActionCreators({
    loadFavorites: actions.loadFavorites,
    mSetCurrentCurrencyPairID: configActions.mSetCurrentCurrencyPairID,
    setSearchValue: actions.setSearchValue,
  }, dispatch);
}

const b = block('m-exchange-rates');

class MExchangeRates extends React.PureComponent<IProps> {

  private columns: Array<IMTableColumn<IExchangeRate>> = [
    {
      getTitle: () => 'MARKET',
      renderCell: ({ market }: IExchangeRate) => (
        transformAssetName(market.replace('_', '/'))
      ),
    },

    {
      getTitle: () => 'CURRENT',
      renderCell: ({ current, market }: IExchangeRate) => this.props.formatPrice(market, current),
    },

    {
      getTitle: () => 'CHANGE, %',
      renderCell: ({ changePercent }: IExchangeRate) => (
        <RateCell value={floorFloatToFixed(changePercent, 2)} postfix="%" />
      ),
      rightAligned: true,
    },
  ];

  public componentDidMount() {
    const { loadFavorites, currentCurrencyPair, filteredExchangeRates, mSetCurrentCurrencyPairID } = this.props;
    // TODO move this to saga
    if (currentCurrencyPair && currentCurrencyPair.hidden) {
      if (filteredExchangeRates.length) {
        mSetCurrentCurrencyPairID(filteredExchangeRates[0].market);
      }
    }
    loadFavorites();
  }

  public render() {
    return (
      <div className={b()}>
        {this.renderHeader()}
        {this.renderContent()}
      </div>
    );
  }

  private renderHeader() {
    const { onCloseButtonClick } = this.props;
    return (
      <div className={b('header')()}>
        <div className={b('close-button-container')()}>
          <div className={b('close-button')()} onClick={onCloseButtonClick}>
            <Icon className={b('close-icon')()} src={require('./img/close-inline.svg')} />
          </div>
        </div>
        <div className={b('currencies')()}>
          <CounterCurrencyFilters size="middle" />
        </div>
      </div>
    );
  }

  private renderContent() {
    const { filteredExchangeRates, currentCurrencyPair: { id: market } } = this.props;
    return (
      <div className={b('content')()}>
        <div className={b('sub-header')()}>
          <div className={b('current')()}>
            {`Current: ${market}`.replace('_', '/')}
          </div>
          <div className={b('search')()}>
            <Input
              search
              onChange={this.handleSearchInputChange}
              placeholder="Search"
            />
          </div>
        </div>
        <div className={b('table')()}>
          <MTable
            columns={this.columns}
            records={filteredExchangeRates}
            getRecordID={this.getExchangeRateId}
            onRowClick={this.handleTableRowClick}
          />
        </div>
      </div>
    );
  }

  private getExchangeRateId({ market }: IExchangeRate) {
    return market;
  }

  @bind
  private handleTableRowClick({ market }: IExchangeRate) {
    const { onMarketSelect, mSetCurrentCurrencyPairID } = this.props;
    mSetCurrentCurrencyPairID(market);
    if (onMarketSelect) {
      onMarketSelect();
    }
  }

  @bind
  private handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { setSearchValue } = this.props;
    setSearchValue(event.target.value);
  }
}

export { MExchangeRates };
export default connect(mapState, mapDispatch)(MExchangeRates);
