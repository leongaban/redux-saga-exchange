import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "tradeHistory" */ './entry').then(feature => feature.entry);
}
