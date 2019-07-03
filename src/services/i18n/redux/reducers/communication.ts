import { makeCommunicationReducer } from 'shared/helpers/redux';
import { combineReducers } from 'redux';
import initial from '../initial';
import * as NS from '../../namespace';
import { ReducersMap } from 'shared/types/redux';

export default combineReducers({
  changeLanguageFetching: makeCommunicationReducer<NS.IChangeLanguage,
   NS.IChangeLanguageCompleted, NS.IChangeLanguageFail>(
    'I18N_SERVICE:CHANGE_LANGUAGE',
    'I18N_SERVICE:CHANGE_LANGUAGE_COMPLETED',
    'I18N_SERVICE:CHANGE_LANGUAGE_FAIL',
    initial.communications.changeLanguageFetching,
  ),
} as ReducersMap<NS.IReduxState['communications']>);
