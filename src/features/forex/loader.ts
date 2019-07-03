import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "forex" */ './entry').then(feature => feature.entry);
}
