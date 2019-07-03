import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';

import { IAppReduxState } from 'shared/types/app';
import {
  IAsset, IAssetsInfoMap, ICurrencyPair, BalanceModalNames, ISetBalanceModalPropsPayload, IHoldingCurrencyCode,
} from 'shared/types/models';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { selectors as configSelectors, actions as configActions } from 'services/config';
import { Checkbox } from 'shared/view/elements';

import { selectors } from '../../../../redux';
import { MAssetsTable, SearchForm } from '../../../components';
import './MAssets.scss';

interface IOwnProps {
  setModalProps(data: ISetBalanceModalPropsPayload<BalanceModalNames>): void;
  loadDepositAddress(data: IHoldingCurrencyCode): void;
  onTradeMenuEntrySelect(x: ICurrencyPair): void;
}

interface IStateProps {
  assetsInfo: IAssetsInfoMap;
  assets: IAsset[];
  conversionCurrency: string;
  estimatedSumInUSDT: number | null;
  estimatedSumInBTC: number | null;
  hideSmallBalances: boolean;
  getAssetCurrencyPairs(asset: string): ICurrencyPair[];
}

interface IActionProps {
  saveUserConfig: typeof configActions.saveUserConfig;
}

type IProps = IOwnProps & IStateProps & ITranslateProps & IActionProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    assetsInfo: configSelectors.selectAssetsInfo(state),
    assets: selectors.selectFilteredAssets(state),
    conversionCurrency: selectors.selectConversionCurrency(state),
    getAssetCurrencyPairs: selectors.selectAssetCurrencyPairsGetter(state),
    estimatedSumInUSDT: selectors.selectEstimatedSumInUSDT(state),
    estimatedSumInBTC: selectors.selectEstimatedSumInBTC(state),
    hideSmallBalances: configSelectors.selectHideSmallBalances(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    saveUserConfig: configActions.saveUserConfig,
  }, dispatch);
}

const b = block('m-balance-assets');

class MAssets extends React.PureComponent<IProps> {

  public render() {
    const {
      conversionCurrency, assetsInfo, getAssetCurrencyPairs, estimatedSumInBTC, estimatedSumInUSDT,
      translate: t, onTradeMenuEntrySelect, hideSmallBalances, assets
    } = this.props;

    return (
      <div className={b()}>
        <div className={b('estimated-value')()}>
          <div className={b('estimated-value-label')()}>
            {t('ASSETS:ESTIMATED-VALUE-LABEL')}
          </div>
          <div className={b('estimated-value-value')()}>
            {`${this.getEstimatedValue(estimatedSumInUSDT, 'USDT')}
            / ${this.getEstimatedValue(estimatedSumInBTC, 'BTC')}`}
          </div>
        </div>
        <div className={b('filters')()}>
          <div className={b('filters-search')()}>
            <SearchForm />
          </div>
          <div className={b('filters-hide-small-balances')()}>
            <Checkbox
              label={t('BALANCE:ASSETS:SMALL-BALANCES-CHECKBOX-LABEL')}
              checked={hideSmallBalances}
              onChange={this.handleSmallBalancesCheckboxChange}
            />
          </div>
        </div>
        <div className={b('table')()}>
          <MAssetsTable
            assets={assets}
            conversionCurrency={conversionCurrency}
            assetsInfo={assetsInfo}
            getAssetCurrencyPairs={getAssetCurrencyPairs}
            onTradeMenuEntrySelect={onTradeMenuEntrySelect}
            onDepositButtonClick={this.handleDepositButtonClick}
            onWithdrawButtonClick={this.handleWithdrawButtonClick}
            onSimplexButtonClick={this.handleSimplexButtonClick}
          />
        </div>
      </div>
    );
  }

  @bind
  private handleDepositButtonClick(code: string) {
    const { setModalProps, loadDepositAddress } = this.props;

    setModalProps({
      name: 'depositCoins',
      props: { isOpen: true, currencyCode: code, address: null },
    });
    loadDepositAddress({ currencyCode: code });
  }

  @bind
  private handleWithdrawButtonClick(code: string) {
    this.props.setModalProps({
      name: 'withdrawCoins',
      props: {
        currencyCode: code,
        isOpen: true,
      },
    });
  }

  @bind
  private handleSimplexButtonClick(code: string) {
    const { setModalProps, loadDepositAddress } = this.props;

    loadDepositAddress({ currencyCode: code });
    setModalProps({
      name: 'simplex',
      props: { isOpen: true, currency: code },
    });
  }

  @bind
  private handleSmallBalancesCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.persist();
    this.props.saveUserConfig({ hideSmallBalances: event.target.checked });
  }

  @bind
  private getEstimatedValue(value: number | null, unit: string) {
    return value === null ? ' - ' : `${value} ${unit}`;
  }
}

export default (
  connect(mapState, mapDispatch)(
    i18nConnect(
      MAssets
    )));
