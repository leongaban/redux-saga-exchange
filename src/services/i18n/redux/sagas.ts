import { takeLatest, call, put, all } from 'redux-saga/effects';

import { IDependencies } from 'shared/types/app';
import getErrorMsg from 'shared/helpers/getErrorMsg';
import moment from 'services/moment';

import { IChangeLanguage, ILocale } from '../namespace';

function getSaga({ api }: IDependencies) {
  function* executeLanguageLoading({ payload: language }: IChangeLanguage) {
    try {
      const languageTranslations: ILocale = yield call(api.storage.changeLanguage, language);
      moment.updateLocale(language, {});
      yield put({
        type: 'I18N_SERVICE:CHANGE_LANGUAGE_COMPLETED',
        payload: {
          language,
          locale: languageTranslations,
        },
      });
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'I18N_SERVICE:CHANGE_LANGUAGE_FAILED', payload: message });
    }
  }

  function* saga() {
    yield all([
      takeLatest('I18N_SERVICE:CHANGE_LANGUAGE', executeLanguageLoading),
    ]);
  }

  return saga;
}

export default getSaga;
