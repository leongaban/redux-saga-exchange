import { createSelector } from 'reselect';
import * as R from 'ramda';
import { getFormValues } from 'redux-form';

import { IAppReduxState } from 'shared/types/app';
import { IAsset, IEstimatedAsset, IAssetInfo } from 'shared/types/models';
import { convertCurrency, currencyPathBFS } from 'shared/helpers/currencyConverter';
import { selectors as configSelectors } from 'services/config';
import { selectors as userSelectors } from 'services/user';
import { selectors as miniTickerSelectors } from 'services/miniTickerDataSource';
import { selectors as openOrdersSelectors } from 'services/openOrdersDataSource';
import { includesSearchValue } from 'shared/helpers/filters';

import * as NS from '../namespace';
import { assetsSearchFormEntry } from './reduxFormEntries';
import { balanceMinValueInBtc } from '../constants';

export function getFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.assets;
}

export function selectConversionCurrency(state: IAppReduxState): string {
  return getFeatureState(state).edit.conversionCurrency;
}

export function selectEditAssetModalDisplayStatus(state: IAppReduxState): boolean {
  return getFeatureState(state).ui.isEditAssetModalShown;
}

export function selectCurrentAsset(state: IAppReduxState): IAssetInfo | null {
  return getFeatureState(state).edit.currentAsset;
}

export const selectAssetCurrencyPairsGetter = createSelector(
  configSelectors.selectCurrencyPairs,
  (pairs) => R.memoizeWith(R.identity, (assetCode: string) =>
    pairs.filter(x => x.baseCurrency === assetCode || x.counterCurrency === assetCode),
  ),
);

export const selectAssets = createSelector(
  userSelectors.selectBalanceDict,
  configSelectors.selectCurrencyGraph,
  selectConversionCurrency,
  configSelectors.selectAssetsInfo,
  miniTickerSelectors.selectExchangeRatesDict,
  openOrdersSelectors.selectInOrderValues,
  (userAssets, currencyGraph, conversionCurrency, assetsInfo, exchangeRatesDict, inOrderValues) => {

    const convertTotal = (from: string, to: string, value: number | undefined) => {
      if (currencyGraph === 'pending' || Object.keys(exchangeRatesDict).length === 0) {
        return null;
      }
      const path = currencyPathBFS(from, to, currencyGraph);
      const convertedCurrency = path && value ? convertCurrency(value, path, exchangeRatesDict) : null;
      return convertedCurrency ? convertedCurrency.toNumber() : null;
    };

    return Object.keys(assetsInfo).map((code): IAsset => {
      const inOrder = inOrderValues[code] || 0;
      const available = userAssets[code] || 0;
      const total = available + inOrder;
      return {
        code,
        name: code in assetsInfo ? assetsInfo[code].assetName : '',
        iconSrc: code in assetsInfo ? assetsInfo[code].imageUrl : '',
        total,
        available,
        inOrder,
        convertedTotal: convertTotal(code, conversionCurrency, total),
        convertedTotalInBtc: convertTotal(code, 'btc', total),
      };
    });
  },
);

export const selectAssetsFilter = createSelector(
  (state: IAppReduxState) => getFormValues(assetsSearchFormEntry.name)(state) as NS.IAssetsSearchForm,
  configSelectors.selectHideSmallBalances,
  (searchForm, hideSmallBalances) => {
    const filters = [];
    if (searchForm && searchForm.search) {
      const { search } = searchForm;
      const includesSeachValue = (asset: IAsset) => {
        return includesSearchValue(asset.code, search) || includesSearchValue(asset.name, search);
      };
      filters.push(includesSeachValue);
    }
    if (hideSmallBalances) {
      const filterSmallBalances = ({ convertedTotalInBtc }: IAsset) => {
        return convertedTotalInBtc ? convertedTotalInBtc > balanceMinValueInBtc : false;
      };
      filters.push(filterSmallBalances);
    }
    return R.filter<IAsset>(R.allPass(filters));
  },
);

export const selectFilteredAssets = createSelector(
  selectAssets,
  selectAssetsFilter,
  (assets, filter) => {
    return filter(assets);
  },
);

function makeEstimatedSumSelector(conversionCurrency: string) {
  return createSelector(
    selectAssets,
    configSelectors.selectCurrencyGraph,
    miniTickerSelectors.selectExchangeRatesDict,
    (assets, graph, exchangeRatesDict) => {

      if (graph === 'pending' || Object.keys(exchangeRatesDict).length === 0) {
        return null;
      }

      return assets.reduce((acc, x) => {
        const path = currencyPathBFS(x.code, conversionCurrency, graph);
        if (path) {
          const converted = convertCurrency(x.total, path, exchangeRatesDict);
          if (converted) {
            return acc + converted.toNumber();
          }
        }
        return acc;
      }, 0);
    },
  );
}

export const selectEstimatedSumInUSDT = makeEstimatedSumSelector('usdt');
export const selectEstimatedSumInBTC = makeEstimatedSumSelector('btc');

export const selectEstimatedTop4AndOther = createSelector(
  selectAssets,
  (assets): IEstimatedAsset[] => {
    const sorted = R.sort(R.descend((x: IAsset) => x.convertedTotal), assets);

    const [top4, other] = R.splitAt(4, sorted);

    return R.sort(
      R.descend((x: IEstimatedAsset) => x.value),
      [
        ...top4.map((x: IAsset): IEstimatedAsset =>
          ({ name: x.code, value: x.convertedTotal || 0 })),
        {
          name: 'Other',
          value: R.sum(other.map(x => x.convertedTotal || 0)),
        },
      ],
    );
  },
);
