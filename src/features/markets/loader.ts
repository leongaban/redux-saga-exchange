import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "markets" */ './entry').then(feature => feature.entry);
}
