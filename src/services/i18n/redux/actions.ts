import { makeCommunicationActionCreators } from 'shared/helpers/redux';

import * as NS from './../namespace';

// tslint:disable:max-line-length
export const { execute: changeLanguage, completed: changeLanguageCompleted, failed: changeLanguageFail } =
  makeCommunicationActionCreators<NS.IChangeLanguage, NS.IChangeLanguageCompleted, NS.IChangeLanguageFail>(
    'I18N_SERVICE:CHANGE_LANGUAGE', 'I18N_SERVICE:CHANGE_LANGUAGE_COMPLETED', 'I18N_SERVICE:CHANGE_LANGUAGE_FAIL',
  );
