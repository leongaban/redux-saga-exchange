import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { ISortInfo } from 'shared/types/ui';
import {
  IAsset, IAssetColumnData, IAssetNonColumnData, IAssetColumns, IAssetsInfoMap, ICurrencyPair,
} from 'shared/types/models';
import { Table } from 'shared/view/components';
import { Icon, Tooltip, CoinCell } from 'shared/view/elements';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { formatAssetWithCommas } from 'shared/helpers/number';
import { getTableRowHoverColor } from 'shared/view/styles/themes';
import { transformAssetName } from 'shared/helpers/converters';

import { makeActionButtons } from './makeActionButtons/makeActionButtons';
import './AssetsTable.scss';

interface IOwnProps {
  assets: IAsset[];
  assetsInfo: IAssetsInfoMap;
  conversionCurrency: string;
  onTradeMenuEntrySelect(x: ICurrencyPair): void;
  getAssetCurrencyPairs(asset: string): ICurrencyPair[];
  onDepositButtonClick(code: string): void;
  onWithdrawButtonClick(code: string): void;
  onSimplexButtonClick(code: string): void;
}

const b = block('assets-table');

type IProps = IOwnProps & ITranslateProps;

const BalanceTable = Table as new () => Table<IAssetColumnData, IAssetNonColumnData, 'actions'>;

class AssetsTable extends React.PureComponent<IProps> {
  private actionButtons = makeActionButtons(this.props);

  private columns: IAssetColumns = {
    code: {
      title: () => 'Coin',
      renderCell: ({ code, iconSrc }: IAsset) => <CoinCell code={code} iconSrc={iconSrc} />,
    },
    name: {
      title: () => 'Coin name',
    },
    total: {
      title: () => 'Total balance',
      renderCell: ({ total, code }: IAsset) => {
        return <span>{formatAssetWithCommas(code, total || 0, this.props.assetsInfo)}</span>;
      },
    },
    available: {
      title: () => 'Available balance',
      renderCell: ({ available, code }: IAsset) => {
        return <span>{formatAssetWithCommas(code, available || 0, this.props.assetsInfo)}</span>;
      },
    },
    inOrder: {
      title: () => 'In order',
      renderCell: ({ inOrder, code }: IAsset) => {
        return <span>{formatAssetWithCommas(code, inOrder || 0, this.props.assetsInfo)}</span>;
      },
    },
    convertedTotal: {
      title: () => `${transformAssetName(this.props.conversionCurrency)} value`,
      renderCell: ({ convertedTotal }: IAsset) => {
        const { conversionCurrency } = this.props;
        return convertedTotal === null
          ? '\u2014'
          : <span>{formatAssetWithCommas(conversionCurrency, convertedTotal, this.props.assetsInfo)}</span >;
      },
    },
  };

  private extraColumns = {
    actions: {
      title: () => '',
      isSortable: false,
      width: 19,
      renderCell: this.renderActions,
    },
  };

  private sortInfo: ISortInfo<IAssetColumnData> = {
    column: 'code',
    kind: 'simple',
    direction: 'ascend',
  };

  private table: HTMLDivElement;

  public render() {
    const { assets } = this.props;
    return (
      <div className={b()} ref={this.initTableRef}>
        <BalanceTable
          columns={this.columns}
          records={assets}
          extraColumns={this.extraColumns}
          sortInfo={this.sortInfo}
          getRowHoverColor={getTableRowHoverColor}
          minWidth={94}
          recordIDColumn="code"
        />
      </div>
    );
  }

  @bind
  private initTableRef(x: HTMLDivElement) {
    this.table = x;
  }

  @bind
  private renderActions(record: IAsset) {
    const { assetsInfo } = this.props;
    const assetInfo = assetsInfo[record.code];

    const areActionsDisabled = assetInfo && (!assetInfo.canDeposit || !assetInfo.canWithdrawal);

    const tooltipMessage = (() => {
      let message = '';
      if (areActionsDisabled) {
        message += 'Deposit or/and withdraw temporary disabled';
      }
      return message;
    })();

    return (
      <div className={b('action-column')()}>
        <div>
          {areActionsDisabled &&
            <Tooltip text={tooltipMessage} position="bottom">
              <Icon className={b('warning-icon')()} src={require('./img/error-inline.svg')} />
            </Tooltip>
          }
        </div>
        <div className={b('action-buttons')()}>
          <div className={b('action-button-simplex')()}>
            {this.actionButtons.renderSimplex(record)}
          </div>
          <div className={b('action-button')()}>
            {this.actionButtons.renderDeposit(record)}
          </div>
          <div className={b('action-button')()}>
            {this.actionButtons.renderWithdraw(record)}
          </div>
          <div className={b('action-button')()}>
            {this.actionButtons.renderTrade(record, this.table)}
          </div>
        </div>
      </div>
    );
  }
}

export default (
  i18nConnect(
    AssetsTable,
  )
);
