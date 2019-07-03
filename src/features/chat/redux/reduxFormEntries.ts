import { makeReduxFormEntry } from 'shared/helpers/redux';
import * as NS from '../namespace';

export const chatFormEntry = makeReduxFormEntry<NS.IMessageForm>('chatForm',
  ['text']);

export const searchFormEntry = makeReduxFormEntry<NS.ISearchForm>('searchForm',
  ['text']);
