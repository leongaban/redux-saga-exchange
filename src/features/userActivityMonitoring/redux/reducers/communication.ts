import { combineReducers } from 'redux';
import * as NS from '../../namespace';

import { initial } from '../initial';
import { ReducersMap } from 'shared/types/redux';
import makeCommunicationReducer from 'shared/helpers/redux/communication/makeCommunicationReducer';

// tslint:disable:max-line-length
export default combineReducers<NS.IReduxState['communication']>({
  setLastActivity: makeCommunicationReducer<NS.ISetLastActivity, NS.ISetLastActivityCompleted, NS.ISetLastActivityFailed>(
    'USER_ACTIVITY_MONITORING:SET_LAST_ACTIVITY',
    'USER_ACTIVITY_MONITORING:SET_LAST_ACTIVITY_COMPLETED',
    'USER_ACTIVITY_MONITORING:SET_LAST_ACTIVITY_FAILED',
    initial.communication.setLastActivity,
  ),
} as ReducersMap<NS.IReduxState['communication']>);
