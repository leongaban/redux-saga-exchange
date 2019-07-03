import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "balance" */ './entry').then(feature => feature.entry);
}
