import Translate from './view/Translate/Translate';
import { ICommunication, IAction, IPlainFailAction } from 'shared/types/redux';

export type TranslateFunction = (key: string, args?: Record<string, string>) => string;
export type Lang = 'en';

export type ILocales = {
  [key in Lang]: ILocale;
};

export interface ILocale {
  [key: string]: string;
}

export interface IReduxState {
  data: {
    locales: ILocales;
    currentLocale: keyof ILocales;
  };
  communications: {
    changeLanguageFetching: ICommunication;
  };
}

export interface ITranslateProps {
  locale: Lang;
  Translate: typeof Translate;
  translate: TranslateFunction;
}

export interface IChangeLanguagePayload {
  language: Lang;
  locale: ILocale;
}

export interface IChangeLanguage {
  type: 'I18N_SERVICE:CHANGE_LANGUAGE';
  payload: Lang;
}

export type IChangeLanguageCompleted = IAction<'I18N_SERVICE:CHANGE_LANGUAGE_COMPLETED', IChangeLanguagePayload>;
export type IChangeLanguageFail = IPlainFailAction<'I18N_SERVICE:CHANGE_LANGUAGE_FAIL'>;

export type Action = IChangeLanguage | IChangeLanguageCompleted | IChangeLanguageFail;
