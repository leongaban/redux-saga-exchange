import { IAppReduxState } from 'shared/types/app';
import { ILocales } from '../namespace';

function selectLocaleStrings(state: IAppReduxState, locale: keyof ILocales) {
  return state.i18n.data.locales[locale];
}

function selectCurrentLocale(state: IAppReduxState): keyof ILocales {
  return state.i18n.data.currentLocale;
}

function selectCurrentStrings(state: IAppReduxState): { [key: string]: string } {
  return state.i18n.data.locales[state.i18n.data.currentLocale];
}

function selectLanguageRequestingStatus(state: IAppReduxState): boolean {
  return state.i18n.communications.changeLanguageFetching.isRequesting;
}

export { selectLocaleStrings, selectCurrentLocale, selectCurrentStrings, selectLanguageRequestingStatus };
