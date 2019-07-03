import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "reporting" */ './entry').then(feature => feature.entry);
}
