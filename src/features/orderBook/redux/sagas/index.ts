import { all, takeLatest, select, call } from 'redux-saga/effects';

import { IDependencies } from 'shared/types/app';
import { defaultDocumentTitle } from 'shared/constants';
import { transformAssetName } from 'shared/helpers/converters';
import { selectors as configSelectors } from 'services/config';

import * as NS from '../../namespace';
import * as selectors from '../data/selectors';

function getSaga(deps: IDependencies) {
  const setLastPriceType: NS.ISetLastPrice['type'] = 'ORDER_BOOK:SET_LAST_PRICE';
  const setDefaultDocumentTitleType: NS.ISetDefaultDocumentTitle['type'] = 'ORDER_BOOK:SET_DEFAULT_DOCUMENT_TITLE';

  return function* saga() {
    yield all([
      takeLatest(setLastPriceType, executeSetLastPriceSaga, deps),
      takeLatest(setDefaultDocumentTitleType, executeSetDefaultDocumentTitleSaga, deps),
    ]);
  };
}

function* executeSetLastPriceSaga({ api }: IDependencies) {
  // TODO fix redux-saga types
  const lastPrice: ReturnType<typeof selectors.selectLastPrice> = yield select(selectors.selectLastPrice);
  const pair: ReturnType<typeof configSelectors.selectCurrentCurrencyPair> =
    yield select(configSelectors.selectCurrentCurrencyPair);

  const formatPrice: ReturnType<typeof configSelectors.selectOrderPriceFormatter> =
    yield select(configSelectors.selectOrderPriceFormatter);

  if (pair) {
    const lastPriceValue = lastPrice
      ? formatPrice(pair.id, lastPrice.value)
      : '---';

    const pairText = transformAssetName(`${pair.baseCurrency}/${pair.counterCurrency}`);
    yield call(api.document.setTitle, `${lastPriceValue} | ${pairText} | ${defaultDocumentTitle}`);
  }
}

function* executeSetDefaultDocumentTitleSaga({ api }: IDependencies) {
  yield call(api.document.setTitle, defaultDocumentTitle);
}

export { getSaga };
