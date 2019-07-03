import { Store } from 'redux';
import { bind } from 'decko';

import { IAppReduxState } from 'shared/types/app';
import { TranslateFunction, Lang } from './namespace';

import * as actions from './redux/actions';
import { selectCurrentStrings, selectCurrentLocale, selectLanguageRequestingStatus } from './redux/selectors';
import Translate from './view/Translate/Translate';

/**
 * It is a localization service for whole app.
 * It will be injected inside all classes (including React components) and
 * provide public methods for translation and localization.
 *
 * For passing translate functional inside low level components use getTranslator function,
 * cause it needs to rerender component, when locale will change, and getTranslator will
 * care about rerender components when it needs.
 *
 * For other cases you can use Translate compnent, or translate api function, defined in this service.
 */
type Subscriber = () => void;

class I18n {
  public actions: typeof actions = actions;
  public View: typeof Translate = Translate;
  private _locale: Lang = 'en';
  private subscribers: Subscriber[] = [];
  private isLanguageRequesting: boolean;

  private _store: Store<IAppReduxState>;

  public set store(x: Store<IAppReduxState>) {
    this._store = x;
    this._store.subscribe(this.onStateChange);
  }

  public get locale() {
    return this._locale;
  }

  public get translate() {
    return this.translator;
  }

  /* Subscribe on changing of locale */
  public subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
  }

  /* Unsibscribe from changing of locale */
  public unsubscribe(subscriber: Subscriber) {
    const index = this.subscribers.findIndex(s => s === subscriber);
    this.subscribers.splice(index, 1);
  }

  @bind
  private onStateChange() {
    const state = this._store.getState();
    const locale = selectCurrentLocale(state);
    const isLanguageRequesting = selectLanguageRequestingStatus(state);

    if ((locale !== this._locale) || (!isLanguageRequesting && this.isLanguageRequesting)) {
      this._locale = locale;
      this.translator = (key, args) => this._translate(key, args);
      this.subscribers.forEach(subscriber => subscriber());
    }

    this.isLanguageRequesting = isLanguageRequesting;
  }

  private translator: TranslateFunction = (key: any, args?: Record<string, string>) => this._translate(key, args);

  @bind
  private _translate(key: string, args?: Record<string, string>): string {
    const state = this._store.getState();
    const strings = selectCurrentStrings(state);

    const translation = strings[key] || key;
    if (args) {
      return this._objectTranslation(translation, args);
    } else {
      return translation;
    }
  }

  private _objectTranslation(translation: string, params: Record<string, string>): string {
    return translation.replace(/%{([\w\d]+?)}/g, (_, value) => params[value]);
  }
}

export default I18n;
export const instance = new I18n();
