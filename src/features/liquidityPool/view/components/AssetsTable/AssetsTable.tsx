import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { Input } from 'shared/view/elements';
import { PieChart } from 'shared/view/components';
import { IAssetsInfoMap, ILPAsset } from 'shared/types/models';

import { formatMoney } from 'shared/helpers/liquidityPool';
import './AssetsTable.scss';

interface IProps {
  assetsInfo: IAssetsInfoMap;
  title: string;
  conversionCurrency: string;
  assets: ILPAsset[];
  assetPayoutType: 'daily' | 'historical';
  setAssetFilter(asset: string): void;
}

type IOwnProps = IProps & ITranslateProps;

const b = block('assets-lp-table');
const pluckPayout = (asset: ILPAsset, type: 'daily' | 'historical') =>
  type === 'daily' ? asset.lastPayout : asset.historical;

class AssetsTable extends React.PureComponent<IOwnProps> {
  public render() {
    const { assets, title, translate: t, assetPayoutType } = this.props;
    return (assets && assets.length > 0) ? (
      <div className={b('cell')()}>
        <section className={b('cell-header')()}>
          <h4>{title}</h4>
        </section>
        <div className={b('container')()}>
          <div className={b('bigger-col')()}>
            <div className={b('controls')()}>
              <div className={b('controls-left')()}>
                <div className={b('controls-title')()}>{t('LIQUIDITYPOOL:ASSETS-TABLE:ASSETS')}</div>
                <div className={b('filter')()}>
                  <Input
                    search
                    extent="middle"
                    onChange={this.handleFilterAsset}
                  />
                </div>
              </div>
              <div className={b('value')()}>{t('LIQUIDITYPOOL:ASSETS-TABLE:VALUE')}</div>
            </div>
            <div className={b('table')()}>
              {this.mapDailyAssets(assets)}
            </div>
          </div>

          <span className={b('pie-chart-container')()}>
            <div className={b('chart')()}>
              <PieChart
                data={this.getChartData()}
                piechartID={`${assetPayoutType}-piechart`}
              />
            </div>
          </span>
        </div>
      </div>
    ) : (
        <div className={b('cell')()}>
          <section className={b('cell-header')()}>
            <h4>{title}</h4>
          </section>
          <div className={b('errors')()}>
            <p>{t('LIQUIDITYPOOL:ASSETS-TABLE:NEW-USER-MESSAGE')}</p>
          </div>
        </div>);
  }

  @bind
  private getChartData() {
    const { assets, assetPayoutType } = this.props;
    return assets.map((asset) => ({
      name: asset.symbol,
      value: pluckPayout(asset, assetPayoutType)
    }));
  }

  @bind
  private handleFilterAsset(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.setAssetFilter(event.target.value);
  }

  @bind
  private buildAssetRow(asset: ILPAsset) {
    const { assetsInfo, assetPayoutType, conversionCurrency } = this.props;

    return (
      <div className={b('table-row')()} key={asset.symbol}>
        <div className={b('asset-symbol')()}>{asset.symbol.toUpperCase()}</div>
        <div className={b('asset-values-container')()}>
          <div className={b('asset-value')()}>
            {formatMoney(pluckPayout(asset, assetPayoutType), conversionCurrency, assetsInfo)}
          </div>
        </div>
      </div>
    );
  }

  @bind
  private mapDailyAssets(assets: ILPAsset[]) {
    const { assetPayoutType } = this.props;
    if (assetPayoutType === 'daily') {
      return assets.map((asset) => (
        asset.lastPayout !== 0 ? this.buildAssetRow(asset) : null
      ));
    } else if (assetPayoutType === 'historical') {
      return assets.map((asset) => (
        asset.historical !== 0 ? this.buildAssetRow(asset) : null
      ));
    }
  }
}

export default (i18nConnect(AssetsTable));
