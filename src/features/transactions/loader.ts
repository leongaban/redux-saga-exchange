import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "transactions" */ './entry').then(feature => feature.entry);
}
