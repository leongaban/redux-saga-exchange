import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "placeOrder" */ './entry').then(feature => feature.entry);
}
