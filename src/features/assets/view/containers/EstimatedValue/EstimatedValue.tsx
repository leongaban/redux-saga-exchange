import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import * as R from 'ramda';
import { connect } from 'react-redux';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { selectors as configSelectors } from 'services/config';
import { IAppReduxState } from 'shared/types/app';
import { IAssetsInfoMap, IEstimatedAsset } from 'shared/types/models';
import { floorFloatToFixed, formatDecimalIfLarge } from 'shared/helpers/number';
import { transformAssetName } from 'shared/helpers/converters';
import { PieChart } from 'shared/view/components';

import { selectors } from '../../../redux';
import './EstimatedValue.scss';

interface IStateProps {
  assetsInfo: IAssetsInfoMap;
  estimatedSumInUSD: number | null;
  estimatedTop4AndOther: IEstimatedAsset[];
  conversionCurrency: string;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    estimatedSumInUSD: selectors.selectEstimatedSumInUSDT(state),
    estimatedTop4AndOther: selectors.selectEstimatedTop4AndOther(state),
    conversionCurrency: selectors.selectConversionCurrency(state),
    assetsInfo: configSelectors.selectAssetsInfo(state),
  };
}

type IProps = ITranslateProps & IStateProps;

const b = block('estimated-value');

class EstimatedValue extends React.PureComponent<IProps> {
  public render() {
    const { estimatedTop4AndOther } = this.props;
    return (
      <div className={b()}>
        <PieChart
          data={estimatedTop4AndOther}
          piechartID="estimated-value-piechart"
          legendID="estimated-value-piechart-legend"
          legendHeader={this.renderLegendHeader()}
          decimals={this.pieChartDecimals}
        />
      </div>
    );
  }

  @bind
  private renderLegendHeader() {
    const { estimatedSumInUSD, estimatedTop4AndOther, conversionCurrency, translate: t } = this.props;
    const currentEstimatedSum = R.sum(estimatedTop4AndOther.map(x => x.value));
    const formattedUSD = estimatedSumInUSD === null ? ' - ' : `${this.formatValue(estimatedSumInUSD, 'usdt')} USDT / `;
    const formattedValue = `${this.formatValue(currentEstimatedSum, conversionCurrency)}
      ${transformAssetName(conversionCurrency)}`;
    return (
      <>
        <div className={b('title')()}>{t('BALANCE-LAYOUT:TOTAL-BALANCE-HEADER')}</div>
        <div className={b('legend-header')()}>
          <span className={b('legend-header-text')()}>
            {`${t('ASSETS:ESTIMATED-VALUE-LABEL')} ≈ `}
          </span>
          <span className={b('legend-header-prices')()}>
            {
              conversionCurrency !== 'usdt'
                ? formattedUSD
                : null
            }
            {formattedValue}
          </span>
        </div>
      </>
    );
  }

  @bind
  private formatValue(value: number, asset: string) {
    const formattedValue = floorFloatToFixed(value, this.getDecimals(asset));
    return formatDecimalIfLarge(formattedValue);
  }

  private getDecimals(asset: string) {
    const { assetsInfo } = this.props;
    // because usdt estimated values should be always with 2 decimals, Dmitry Fider ask
    const accuracy = asset in assetsInfo && asset !== 'usdt'
      ? assetsInfo[asset].scale
      : 2;
    return accuracy;
  }

  private get pieChartDecimals() {
    return this.getDecimals(this.props.conversionCurrency);
  }
}

export default (
  connect(mapState)(
    i18nConnect(
      EstimatedValue,
    ),
  )
);
