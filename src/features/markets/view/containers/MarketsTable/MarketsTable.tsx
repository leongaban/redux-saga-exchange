import React from 'react';
import { bind } from 'decko';
import block from 'bem-cn';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { Table } from 'shared/view/components';
import { Button, Radio } from 'shared/view/elements';
import { ISortInfo } from 'shared/types/ui';
import {
  IMarketsTableColumns,
  IAbstractMarket,
  IMarket,
} from 'shared/types/models';
import { IAppReduxState } from 'shared/types/app';

import { actions, selectors } from '../../../redux';

import './MarketsTable.scss';

const b = block('markets-table');

const MarketsColumns: IMarketsTableColumns = {
  name: {
    title: () => 'Market Name',
  },
  nominal: {
    title: () => 'Nominal Currency',
  },
  limit: {
    title: () => 'Limit Currency',
  },
  makerFee: {
    title: () => 'Order Maker Fee',
    renderCell: (record: IMarket) => <span>{record.makerFee}</span>,
  },
  takerFee: {
    title: () => 'Order Taker Fee',
    renderCell: (record: IMarket) => <span>{record.takerFee}</span>,
  },
  priceScale: {
    title: () => 'Quote Scale',
    renderCell: (record: IMarket) => <span>{record.priceScale}</span>,
  },
  amountScale: {
    title: () => 'Base Scale',
    renderCell: (record: IMarket) => <span>{record.amountScale}</span>,
  },
  minOrderValue: {
    title: () => 'Min Order Value',
    renderCell: (record: IMarket) => <span>{record.minOrderValue}</span>,
  },
  minTradeAmount: {
    title: () => 'Min Trade Amount',
    renderCell: (record: IMarket) => <span>{record.minTradeAmount}</span>,
  },
};

const defaultSortInfo: ISortInfo<IMarketsTableColumns> = {
  column: 'name',
  direction: 'descend',
  kind: 'simple',
};

const MarketsTableWrapper = Table as new () => Table<IAbstractMarket, IMarket, 'actions'>;

interface IOwnProps {
  filter?: string;
}

interface IStateProps {
  markets: IMarket[];
  isEditMarketModalShown: boolean;
}

interface IDispatchProps {
  load: typeof actions.load;
  editMarket: typeof actions.editMarket;
  setCurrentMarket: typeof actions.setCurrentMarket;
  setEditMarketModalState: typeof actions.setEditMarketModalState;
}

type IProps = IStateProps & IOwnProps & IDispatchProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    markets: selectors.selectMarkets(state),
    isEditMarketModalShown: selectors.selectIsEditMarketModalShown(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IDispatchProps {
  return bindActionCreators(actions, dispatch);
}

class MarketsTable extends React.PureComponent<IProps> {

  public state = {
    activeTab: null,
  };

  private extraColumns = {
    actions: {
      title: () => 'Actions',
      isSortable: false,
      renderCell: this.actionsCell,
    },
  };

  public render() {
    const filteredMarkets: IMarket[] = this.markets;
    return (
      <MarketsTableWrapper
        columns={MarketsColumns}
        records={filteredMarkets}
        extraColumns={this.extraColumns}
        recordIDColumn="id"
        minWidth={110}
        sortInfo={defaultSortInfo}
      />
    );
  }

  @bind
  private actionsCell(record: IMarket) {
    const tabs = ['Active', 'Inactive'];
    const segments = tabs.map((tab) => {
      const isActive = (() => {
        if (tab === 'Active' && !record.hidden || tab === 'Inactive' && record.hidden) {
          return true;
        }
        return false;
      })();
      return {
        title: tab,
        key: tab,
        active: isActive,
        onClick: this.makeMarketStatusChangeHandler(tab, record),
      };
    });
    return (
      <div className={b('actions')()}>
        {segments.map(({ active, key, onClick, title }, index) => (
          <Radio
            key={key}
            name="market-status"
            label={title}
            position={index === 0 ? 'left' : 'right'}
            extent="small"
            readOnly
            checked={active}
            onClick={onClick}
            fontSize={'small'}
          />
        ))}
        <div className={b('edit-button')()}>
          <Button color="text-blue" size="small" onClick={this.makeEditButtonClickHandler(record)}>
            Edit
          </Button>
        </div>
      </div>
    );
  }

  private get markets() {
    const { filter, markets } = this.props;
    if (filter) {
      return markets.filter(x => x.name.toLowerCase().includes(filter.toLowerCase()));
    } else {
      return markets;
    }
  }

  @bind
  private makeMarketStatusChangeHandler(tab: string, market: IMarket) {
    return () => this.props.editMarket({ id: market.id, hidden: tab === 'Inactive' });
  }

  @bind
  private makeEditButtonClickHandler(record: IMarket) {
    return () => {
      this.props.setCurrentMarket(record);
      this.props.setEditMarketModalState(true);
    };
  }
}

export default connect(mapState, mapDispatch)(MarketsTable);
