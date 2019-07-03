import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "assets" */ './entry').then(feature => feature.entry);
}
