import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "orderBook" */ './entry').then(feature => feature.entry);
}
