import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { IMTableColumn, IMTableRowSubcontent } from 'shared/types/ui';

import { IAsset, IAssetsInfoMap, ICurrencyPair } from 'shared/types/models';
import { formatAssetWithCommas } from 'shared/helpers/number';
import { MTable } from 'shared/view/components';
import { CoinCell } from 'shared/view/elements';

import { makeActionButtons } from '../makeActionButtons/makeActionButtons';
import './MAssetsTable.scss';

interface IOwnProps {
  assets: IAsset[];
  assetsInfo: IAssetsInfoMap;
  conversionCurrency: string;
  getAssetCurrencyPairs(asset: string): ICurrencyPair[];
  onTradeMenuEntrySelect(x: ICurrencyPair): void;
  onDepositButtonClick(code: string): void;
  onWithdrawButtonClick(code: string): void;
  onSimplexButtonClick(code: string): void;
}

type IProps = IOwnProps & ITranslateProps;

const b = block('m-assets-table');

class MAssetsTable extends React.PureComponent<IProps> {
  private actionButtons = makeActionButtons(this.props);

  private columns: Array<IMTableColumn<IAsset>> = [
    {
      getTitle: () => 'COIN',
      renderCell: ({ code, iconSrc }: IAsset) => <CoinCell code={code} iconSrc={iconSrc} />,
      width: { unit: 'rem', value: 6 },
    },

    {
      getTitle: () => 'TOTAL BALANCE',
      renderCell: ({ total, code }: IAsset) => (
        <div className={b('cell-total-content')()}>
          {formatAssetWithCommas(code, total || 0, this.props.assetsInfo)}
        </div>
      ),
      rightAligned: true,
    },
  ];

  private rowSubContent: IMTableRowSubcontent<IAsset> = {
    rows: [
      {
        getTitle: () => 'Name',
        renderValue: ({ name }: IAsset) => name,
      },

      {
        getTitle: () => 'Available',
        renderValue: ({ available, code }: IAsset) => (
          <div className={b('subcontent-value')()}>
            {formatAssetWithCommas(code, available || 0, this.props.assetsInfo)}
          </div>
        )
      },

      {
        getTitle: () => 'In order',
        renderValue: ({ inOrder, code }: IAsset) => (
          <div className={b('subcontent-value')()}>
            {formatAssetWithCommas(code, inOrder || 0, this.props.assetsInfo)}
          </div>
        ),
      },

      {
        getTitle: () => `${this.props.conversionCurrency.toUpperCase()} value`,
        renderValue: ({ convertedTotal, code }: IAsset) => convertedTotal === null
          ? '\u2014'
          : (
            <div className={b('subcontent-value')()}>
              {formatAssetWithCommas(code, convertedTotal, this.props.assetsInfo)}
            </div>
          ),
      },
    ],
    renderBottomPart: this.renderRowSubcontentBottomPart,
  };

  public render() {
    const { assets } = this.props;
    return (
      <div className={b()}>
        <MTable
          records={assets}
          columns={this.columns}
          getRecordID={this.getAssetID}
          rowSubContent={this.rowSubContent}
        />
      </div>
    );
  }

  @bind
  private getAssetID({ code }: IAsset) {
    return code;
  }

  @bind
  private renderRowSubcontentBottomPart(x: IAsset) {

    return (
      <div className={b('action-buttons')()}>
        <div className={b('action-button-simplex')()}>
          {this.actionButtons.renderSimplex(x)}
        </div>
        <div className={b('action-button')()}>
          {this.actionButtons.renderDeposit(x, 'capitalize')}
        </div>
        <div className={b('action-button')()}>
          {this.actionButtons.renderWithdraw(x, 'capitalize')}
        </div>
        <div className={b('action-button')()}>
          {this.actionButtons.renderTrade(x, undefined, 'capitalize')}
        </div>
      </div>
    );

  }
}

export default i18nConnect(MAssetsTable);
