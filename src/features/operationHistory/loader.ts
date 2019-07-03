import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "operationHistory" */ './entry').then(feature => feature.entry);
}
