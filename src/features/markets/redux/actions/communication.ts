import { makeCommunicationActionCreators } from 'shared/helpers/redux/index';
import * as NS from '../../namespace';

export const { execute: load, completed: loadCompleted, failed: loadFailed } =
  makeCommunicationActionCreators<NS.ILoad, NS.ILoadCompleted, NS.ILoadFailed>(
    'MARKETS:LOAD',
    'MARKETS:LOAD_COMPLETED',
    'MARKETS:LOAD_FAILED',
  );

export const { execute: editMarket, completed: editMarketCompleted, failed: editMarketFailed } =
  makeCommunicationActionCreators<NS.IEditMarket, NS.IEditMarketCompleted, NS.IEditMarketFailed>(
    'MARKETS:EDIT_MARKET',
    'MARKETS:EDIT_MARKET_COMPLETED',
    'MARKETS:EDIT_MARKET_FAILED',
  );
