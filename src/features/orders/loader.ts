import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "orders" */ './entry').then(feature => feature.entry);
}
