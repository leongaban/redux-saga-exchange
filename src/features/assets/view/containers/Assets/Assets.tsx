import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';

import { IAppReduxState } from 'shared/types/app';
import {
  IAsset, IAssetsInfoMap, IHoldingCurrencyCode, ISetBalanceModalPropsPayload,
  BalanceModalNames, ICurrencyPair,
} from 'shared/types/models';
import { Checkbox, Select, Tooltip, Icon } from 'shared/view/elements';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { transformAssetName } from 'shared/helpers/converters';
import { selectors as configSelectors, actions as configActions } from 'services/config';

import { actions, selectors } from '../../../redux';
import { AssetsTable, SearchForm } from '../../components';
import './Assets.scss';

interface IActionProps {
  setConversionCurrency: typeof actions.setConversionCurrency;
  saveUserConfig: typeof configActions.saveUserConfig;
}

interface IOwnProps {
  setModalProps(data: ISetBalanceModalPropsPayload<BalanceModalNames>): void;
  loadDepositAddress(data: IHoldingCurrencyCode): void;
  onTradeMenuEntrySelect(x: ICurrencyPair): void;
}

interface IStateProps {
  assets: IAsset[];
  assetsInfo: IAssetsInfoMap;
  conversionCurrency: string;
  hideSmallBalances: boolean;
  getAssetCurrencyPairs(asset: string): ICurrencyPair[];
}

const b = block('balance-assets');

type IProps = IActionProps & IStateProps & ITranslateProps & IOwnProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    assets: selectors.selectFilteredAssets(state),
    conversionCurrency: selectors.selectConversionCurrency(state),
    getAssetCurrencyPairs: selectors.selectAssetCurrencyPairsGetter(state),
    assetsInfo: configSelectors.selectAssetsInfo(state),
    hideSmallBalances: configSelectors.selectHideSmallBalances(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    setConversionCurrency: actions.setConversionCurrency,
    saveUserConfig: configActions.saveUserConfig,
  }, dispatch);
}

const convertationCurrencyOptions = ['btc', 'eth', 'usdt', 'tiox'];

class Assets extends React.PureComponent<IProps> {
  public render() {
    const {
      translate: t, assetsInfo, conversionCurrency, setConversionCurrency, onTradeMenuEntrySelect,
      getAssetCurrencyPairs, hideSmallBalances, assets,
    } = this.props;
    return (
      <div className={b()}>
        <div className={b('title-and-controls')()}>
          <div className={b('title')()}>
            {t('BALANCE:ASSETS:TITLE')}
          </div>

          <div className={b('controls')()}>
            <div className={b('controls-left')()}>
              <div className={b('search')()}>
                <SearchForm />
              </div>
              <div className={b('filter')()}>
                <Checkbox
                  label={t('BALANCE:ASSETS:SMALL-BALANCES-CHECKBOX-LABEL')}
                  checked={hideSmallBalances}
                  onChange={this.handleSmallBalancesCheckboxChange}
                />
                <span className={b('tooltip')()}>
                  <Tooltip text="Hiding balances less than 0.001 BTC" position="bottom">
                    <Icon className={b('help-icon')()} src={require('./img/help-inline.svg')} />
                  </Tooltip>
                </span>
              </div>
            </div>
            <div className={b('conversion-currency-select')()}>
              <Select
                selectedOption={conversionCurrency}
                options={convertationCurrencyOptions}
                onSelect={setConversionCurrency}
                optionValueKey={this.convertationOptionValueKey}
              />
            </div>
          </div>
        </div>
        <div className={b('table')()}>
          <AssetsTable
            assets={assets}
            onSimplexButtonClick={this.handleSimplexButtonClick}
            onDepositButtonClick={this.handleDepositButtonClick}
            onWithdrawButtonClick={this.handleWithDrawButtonClick}
            assetsInfo={assetsInfo}
            conversionCurrency={conversionCurrency}
            getAssetCurrencyPairs={getAssetCurrencyPairs}
            onTradeMenuEntrySelect={onTradeMenuEntrySelect}
          />
        </div>
      </div>
    );
  }

  @bind
  private convertationOptionValueKey(x: string) {
    return transformAssetName(x);
  }

  @bind
  private handleDepositButtonClick(code: string) {
    const { setModalProps, loadDepositAddress } = this.props;
    loadDepositAddress({ currencyCode: code });
    setModalProps({
      name: 'depositCoins',
      props: { isOpen: true, currencyCode: code },
    });
  }

  @bind
  private handleWithDrawButtonClick(code: string) {
    const { setModalProps } = this.props;
    setModalProps({
      name: 'withdrawCoins',
      props: { isOpen: true, currencyCode: code },
    });
  }

  @bind
  private handleSimplexButtonClick(code: string) {
    const { setModalProps, loadDepositAddress } = this.props;

    loadDepositAddress({ currencyCode: code });
    setModalProps({
      name: 'simplex',
      props: { isOpen: true, currency: code, address: null },
    });
  }

  @bind
  private handleSmallBalancesCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.persist();
    this.props.saveUserConfig({ hideSmallBalances: event.target.checked });
  }
}

export default (
  connect(mapState, mapDispatch)(
    i18nConnect(
      Assets,
    )));
