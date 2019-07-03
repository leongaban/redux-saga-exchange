import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { ITranslateProps, i18nConnect } from 'services/i18n';

import { IAssetsInfoMap } from 'shared/types/models';
import { calculateReturn, removeCommas } from 'shared/helpers/liquidityPool';
import { formatDecimalIfLarge as addCommas } from 'shared/helpers/number';
import { roundFloat as round } from 'shared/helpers/number/roundFloat';
import { Button, Input } from 'shared/view/elements';
import { tioTiers } from 'shared/mocks/liquidityPool';
import { ITierGroup } from 'shared/types/models/liquidityPool';
import './Calculator.scss';

interface IProps {
  assetsInfo: IAssetsInfoMap;
  conversionCurrency: string;
  poolTotalTio: number;
  tioPrice: number;
  usdtCurrencyConverter(value: number): number;
}

interface IState {
  tioCount: string;
  tiers: ITierGroup[];
  totalTioPool: string;
  lpReturnValue: string;
  myReturn: string;
}

type IOwnProps = IProps & ITranslateProps;

const b = block('calculator');

class Calculator extends React.PureComponent<IOwnProps, IState> {
  public static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    const { tioCount, tiers } = prevState;
    const newTiers = tiers.filter((tier) => Number(tier.count) <= Number(removeCommas(tioCount)));

    if (newTiers.length > 0) {
      const newTier = newTiers.pop();

      if (newTier) {
        const updatedTiers = tiers.map(((tier: ITierGroup) => {
          tier.bold = (tier.count === newTier.count);
          return tier;
        }));

        return {
          tiers: updatedTiers,
          ...prevState
        };
      }
    }

    return {
      ...prevState
    };
  }

  constructor(props: IOwnProps) {
    super(props);

    const totalTioPool = String(this.props.poolTotalTio);

    this.state = {
      tioCount: '2500',
      tiers: tioTiers,
      totalTioPool,
      lpReturnValue: '0',
      myReturn: '0'
    };
  }

  public componentDidUpdate(prevProps: IProps) {
    const { poolTotalTio } = prevProps;
    this.setState({ totalTioPool: addCommas(poolTotalTio) });
  }

  public render() {
    const { translate: t, tioPrice } = this.props;
    const { tioCount, tiers, totalTioPool, lpReturnValue, myReturn } = this.state;
    const tiox = ` (TIOx)`;

    return (
      <div className={b('cell')()}>
        <section className={b('cell-header')()}>
          <h4 className={b('cell-title')()}>{t('LIQUIDITYPOOL:CALCULATOR:TITLE')}</h4>
          <p className={b('my-return')()}>
            My Return: {this.renderMyReturn(myReturn)}
          </p>
        </section>

        <div className={b('descriptions-area')()}>
          <div className={b('descriptions')()}>
            <div>
              <span>{t('LIQUIDITYPOOL:CALCULATOR:TIER')}</span>
              <span className={b('view-desktop')()}>{tiox}</span>
            </div>
            <span className={b('view-desktop')()}>
              <div>{t('LIQUIDITYPOOL:CALCULATOR:TIER-MULTIPLIER')} (%)</div>
            </span>
            <span className={b('view-mobile')()}>
              <div>{t('LIQUIDITYPOOL:CALCULATOR:MULTIPLIER')} (%)</div>
            </span>
          </div>
          <div className={b('descriptions')()}>
            <div className={b('tio-value-label')()}>(1 TIOx) = {this.renderSymbol()} {tioPrice}</div>
          </div>
        </div>

        <div className={b('calculation-area')()}>
          <div className={b('left-side')()}>
            <div className={b('cell-tiers')()}>
              <ul>
                {this.renderRanks(tiers)}
              </ul>
            </div>
            <div className={b('cell-percentages')()}>
              <ul>
                {this.renderPercentages(tiers)}
              </ul>
            </div>
          </div>
          <div className={b('right-side')()}>
            <div className={b('liquidity-pool-stats')()}>
              <p>{t('LIQUIDITYPOOL:CALCULATOR:MY')} TIOx</p>
              <Input
                type="text"
                extent="middle"
                onChange={this.handleChangeAmount}
                value={tioCount}
              />
            </div>
            <div className={b('liquidity-pool-stats')()}>
              <p className={b('total-pool-assets')()}>{t('LIQUIDITYPOOL:CALCULATOR:TOTAL-POOL-ASSETS')}</p>
              <Input
                type="text"
                extent="middle"
                onChange={this.handleChangePoolTotal}
                value={totalTioPool}
              />
              <p>{t('LIQUIDITYPOOL:CALCULATOR:LP-RETURN')}</p>
              <Input
                type="text"
                extent="middle"
                onChange={this.handleChangeLPReturn}
                value={lpReturnValue}
              />
            </div>
            <div className={b('calculate-button')()}>
              <Button size="large" color="text-blue" onClick={this.handleCalculate}>
                {t('LIQUIDITYPOOL:CALCULATOR:CALCULATE')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  @bind
  private displayConversionSymbol(currency: string) {
    const { assetsInfo } = this.props;
    /* tslint:disable:max-line-length */
    const usdtSymbol = assetsInfo.usdt ? <img className={b('symbol')()} src={assetsInfo.usdt.imageUrl} height="14" /> : null;
    const btcSymbol = assetsInfo.btc ? <img className={b('symbol')()} src={assetsInfo.btc.imageUrl} height="14" /> : null;
    const ethSymbol = assetsInfo.eth ? <img className={b('symbol')()} src={assetsInfo.eth.imageUrl} height="14" /> : null;
    const tioSymbol = assetsInfo.tiox ? <img className={b('symbol')()} src={assetsInfo.tiox.imageUrl} height="14" /> : null;

    const pickSymbol = (currentCurrency: string) => {
      switch (currentCurrency) {
        case 'btc': return btcSymbol;
        case 'eth': return ethSymbol;
        case 'tiox': return tioSymbol;
        default: return usdtSymbol;
      }
    };

    return pickSymbol(currency);
  }

  @bind
  private renderMyReturn(myReturn: string) {
    const { usdtCurrencyConverter: currencyConvert, conversionCurrency: currency } = this.props;
    const symbol = this.displayConversionSymbol(currency);

    if (currency === 'usdt') {
      return (<span>{symbol} {addCommas(round(currencyConvert(+removeCommas(myReturn)), 8))}</span>);
    }
    return (<span>{symbol} {round(currencyConvert(+removeCommas(myReturn)), 8)}</span>);
  }

  @bind
  private renderSymbol() {
    const { conversionCurrency: currency } = this.props;
    const symbol = this.displayConversionSymbol(currency);
    return (<span>{symbol}</span>);
  }

  @bind
  private handleChangeAmount(event: React.ChangeEvent<HTMLInputElement>) {
    const amount = Number(event.target.value) <= 0 ? 0 : removeCommas(event.target.value);
    this.setState({ tioCount: addCommas(amount) });
  }

  @bind
  private handleChangePoolTotal(event: React.ChangeEvent<HTMLInputElement>) {
    const amount = Number(event.target.value) <= 0 ? 0 : removeCommas(event.target.value);
    this.setState({ totalTioPool: addCommas(amount) });
  }

  @bind
  private handleChangeLPReturn(event: React.ChangeEvent<HTMLInputElement>) {
    const amount = Number(event.target.value) <= 0 ? 0 : removeCommas(event.target.value);
    this.setState({ lpReturnValue: addCommas(amount) });
  }

  @bind
  private handleCalculate() {
    const { tioCount: myTio, totalTioPool: total, lpReturnValue: lp, tiers } = this.state;
    const cleanReturn = calculateReturn(myTio, total, lp, tiers);
    this.setState({ myReturn: cleanReturn });
  }

  @bind
  private renderRanks(tiers: ITierGroup[]) {
    return tiers.map((tier: ITierGroup) => (
      <li key={tier.rank} className={`calculator__bold-${tier.bold}`}>
        <div className={b('rank')()}>
          {tier.rank}
        </div> <div className={b('count')()}>
          {addCommas(tier.count)}
        </div>
      </li>
    ));
  }

  @bind
  private renderPercentages(tiers: ITierGroup[]) {
    return tiers.map((tier: ITierGroup) => (
      <li key={tier.count} className={`calculator__bold-${tier.bold}`}>{tier.percent}</li>
    ));
  }
}

export default (i18nConnect(Calculator));
