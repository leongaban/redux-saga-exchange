import * as NS from '../../namespace';
import initial from '../initial';

type ILanguageState = NS.IReduxState['data'];

export default (function dataReducer(state: ILanguageState = initial.data, action: NS.Action): ILanguageState {
  switch (action.type) {
    case 'I18N_SERVICE:CHANGE_LANGUAGE_COMPLETED': {
      return {
        ...state,
        locales: {
          ...state.locales,
          [action.payload.language]: action.payload.locale,
        },
        currentLocale: action.payload.language,
      };
    }
    default: return state;
  }
}) as ((state: ILanguageState) => ILanguageState);
