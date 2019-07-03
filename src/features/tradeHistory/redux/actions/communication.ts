import { makeCommunicationActionCreators} from 'shared/helpers/redux';
import * as NS from '../../namespace';

export const { execute: load, completed: loadSuccesss, failed: loadFail } =
  makeCommunicationActionCreators<NS.ILoad, NS.ILoadSuccess, NS.ILoadFail>(
    'TRADE_HISTORY:LOAD',
    'TRADE_HISTORY:LOAD_SUCCESS',
    'TRADE_HISTORY:LOAD_FAIL',
  );
