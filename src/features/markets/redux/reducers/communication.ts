import { combineReducers } from 'redux';
import * as NS from '../../namespace';

import { initial } from '../data/initial';
import { ReducersMap } from 'shared/types/redux';
import makeCommunicationReducer from 'shared/helpers/redux/communication/makeCommunicationReducer';

// tslint:disable:max-line-length
export default combineReducers<NS.IReduxState['communication']>({
  load: makeCommunicationReducer<NS.ILoad, NS.ILoadCompleted, NS.ILoadFailed>(
    'MARKETS:LOAD',
    'MARKETS:LOAD_COMPLETED',
    'MARKETS:LOAD_FAILED',
    initial.communication.load,
  ),
  updateMarket: makeCommunicationReducer<NS.IEditMarket, NS.IEditMarketCompleted, NS.IEditMarketFailed>(
    'MARKETS:EDIT_MARKET',
    'MARKETS:EDIT_MARKET_COMPLETED',
    'MARKETS:EDIT_MARKET_FAILED',
    initial.communication.updateMarket,
  ),
} as ReducersMap<NS.IReduxState['communication']>);
