import * as React from 'react';
import { bind } from 'decko';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import block from 'bem-cn';
import { createSelector } from 'reselect';
import * as R from 'ramda';

import { Input, Icon } from 'shared/view/elements/';
import { Table } from 'shared/view/components';
import { floorFloatToFixed } from 'shared/helpers/number';
import {
  IExchangeRate,
  IExchangeRateColumns,
  IExchangeRateColumnData,
  ICurrencyPair,
  IExchangeRatesVisibleColumns,
} from 'shared/types/models';
import { ISortInfo } from 'shared/types/ui';
import { getTableRowHoverColor, getSelectedTableRowHoverColor } from 'shared/view/styles/themes';
import { transformAssetName } from 'shared/helpers/converters';

import { IStateProps, mapState } from './shared';
import { actions } from '../../../redux';
import { RateCell } from '../../components';
import { CounterCurrencyFilters } from '..';
import './ExchangeRates.scss';

interface IDispatchProps {
  loadFavorites: typeof actions.loadFavorites;
  toggleMarketFavoriteStatus: typeof actions.toggleMarketFavoriteStatus;
  setSearchValue: typeof actions.setSearchValue;
  resetUI: typeof actions.resetUI;
}

interface IOwnProps {
  currentCurrencyPair?: ICurrencyPair;
  columnsToDisplay: IExchangeRatesVisibleColumns;
  sortInfo?: ISortInfo<IExchangeRate>;
  onSortInfoChange?(sort: ISortInfo<IExchangeRate>): void;
  onSelect?(record: IExchangeRate): void;
}

type IProps = IStateProps & IDispatchProps & IOwnProps;

function mapDispatch(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators({
    loadFavorites: actions.loadFavorites,
    toggleMarketFavoriteStatus: actions.toggleMarketFavoriteStatus,
    setSearchValue: actions.setSearchValue,
    resetUI: actions.resetUI,
  }, dispatch);
}

const b = block('exchange-rates');

const ExchangeRatesTable = Table as new () => Table<IExchangeRateColumnData, {}, ''>;

class ExchangeRates extends React.PureComponent<IProps> {

  private columns: IExchangeRateColumns = {
    market: {
      title: () => 'Market',
      renderCell: (record: IExchangeRate, selected: boolean) => {
        return (
          <div className={b('market', { selected })()}>
            {transformAssetName(record.market.replace('_', '/'))}
          </div>
        );
      },
    },
    current: {
      title: () => 'Current',
      renderCell: ({ current, market }: IExchangeRate, selected: boolean) => {
        return (
          <div className={b('current', { selected })()}>
            {this.props.formatPrice(market, current)}
          </div>
        );
      },
    },
    changeAbsolute: {
      title: () => 'Change',
      renderCell: ({ changeAbsolute, market }: IExchangeRate, selected: boolean) => {
        return <RateCell value={this.props.formatPrice(market, changeAbsolute)} selected={selected} />;
      },
    },
    changePercent: {
      title: () => 'Change, %',
      renderCell: (record: IExchangeRate, selected: boolean) => {
        return (
          <RateCell value={floorFloatToFixed(record.changePercent, 2)} selected={selected} postfix="%" withArrow />
        );
      },
    },
  };

  private selectFilteredColumns = createSelector(
    () => this.columns,
    (props: IProps) => props.columnsToDisplay,
    (columns, columnsToDisplay): Partial<IExchangeRateColumns> =>
      R.pickBy((_, key: keyof typeof columns) => key === 'market'
        ? true
        : columnsToDisplay[key], columns),
  );

  public componentDidMount() {
    const { loadFavorites, currentCurrencyPair, filteredExchangeRates, onSelect } = this.props;
    if (currentCurrencyPair && currentCurrencyPair.hidden) {
      if (filteredExchangeRates.length) {
        onSelect && onSelect(filteredExchangeRates[0]);
      }
    }
    loadFavorites();
  }

  public componentWillUnmount() {
    this.props.resetUI();
  }

  public render() {
    const { currentCurrencyPair, sortInfo, onSelect, onSortInfoChange, filteredExchangeRates } = this.props;

    const currentExchangeRate = (() => {
      if (currentCurrencyPair) {
        return filteredExchangeRates.find(exchangeRate => exchangeRate.market === currentCurrencyPair.id);
      }
    })();

    return (
      <div className={b()}>
        <div className={b('controls')()}>
          <div className={b('search')()}>
            <Input
              search
              onChange={this.handleSearchInputChange}
              placeholder="Search"
            />
          </div>
          <div className={b('controls-gap')()} />
          <div className={b('tabs')()}>
            <CounterCurrencyFilters size="small" />
          </div>
        </div>
        <div className={b('table')()}>
          <ExchangeRatesTable
            columns={this.selectFilteredColumns(this.props)}
            records={filteredExchangeRates}
            selectedRecord={currentExchangeRate}
            areRecordsEqual={this.areRecordsEqual}
            renderHeaderRow={this.renderRowHeader}
            onRecordSelect={onSelect}
            sortInfo={sortInfo}
            onSortInfoChange={onSortInfoChange}
            recordIDColumn="market"
            minWidth={23}
            getRowHoverColor={getTableRowHoverColor}
            getSelectedRowHoverColor={getSelectedTableRowHoverColor}
          />
        </div>
      </div>
    );
  }

  private makeToggleMarketFavoriteStatus(market: string) {
    const { toggleMarketFavoriteStatus } = this.props;
    return (event: React.SyntheticEvent<HTMLElement>) => {
      toggleMarketFavoriteStatus(market);
      event.stopPropagation();
    };
  }

  @bind
  private renderRowHeader(record: IExchangeRate) {
    return (
      <div
        className={b('toggle-favorites-checkbox', { favorite: this.isMarketInFavorites(record) })()}
        onClick={this.makeToggleMarketFavoriteStatus(record.market)}
      >
        <Icon src={require('../../img/fav-inline.svg')} className={b('fav-icon')()} />
      </div>
    );
  }

  @bind
  private isMarketInFavorites(record: IExchangeRate) {
    const { favorites } = this.props;
    return R.contains(record.market, favorites);
  }

  @bind
  private handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { setSearchValue } = this.props;
    setSearchValue(event.target.value);
  }

  private areRecordsEqual(record: IExchangeRate, selectedRecord: IExchangeRate): boolean {
    return record.market === selectedRecord.market;
  }
}

export { IProps };
export default connect<IStateProps, IDispatchProps>(mapState, mapDispatch)(ExchangeRates);
