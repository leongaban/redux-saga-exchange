import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "widgets" */ './entry').then(feature => feature.entry);
}
