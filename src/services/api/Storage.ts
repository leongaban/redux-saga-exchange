import { bind } from 'decko';
import { Moment } from 'moment';
import moment from 'services/moment';

import BaseApi from './Base';

class StorageApi extends BaseApi {
  private lastActiveTime = 'lastActiveTime';

  @bind
  public async changeLanguage(language: string) {
    try {
      this.storage.set('lang', language);
    } catch (e) {
      console.log('error with setting language', e);
    }
    // const response = await this.actions.getSource(`/js/trade-${language}.json`);
    const data = require('../i18n/locales/trade-en.json');
    return data;
    // return response.data;
  }

  @bind
  public setLastActiveTime(value: Moment) {
    this.storage.set(this.lastActiveTime, value);
  }

  @bind
  public getLastActiveTime() {
    const lastActiveTime = this.storage.get<string, string>(this.lastActiveTime, '');
    return moment(lastActiveTime);
  }
}

export default StorageApi;
