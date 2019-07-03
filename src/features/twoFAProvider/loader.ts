import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "twoFAProvider" */ './entry').then(feature => feature.entry);
}
