import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "liquidityPool" */ './entry').then(feature => feature.entry);
}
